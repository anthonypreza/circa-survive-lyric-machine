"""
circa-survive-lyric-machine API.
"""

from __future__ import annotations

import uuid
import json
import logging
import os
import sys
from typing import Any, Dict

import numpy as np  # type: ignore
import tensorflow as tf  # type: ignore
from multiprocessing import Process
from flask import Flask, Response, jsonify, request
from tensorflow import keras  # type: ignore


API_DIR: str = os.path.dirname(__file__)
CACHE_DIR: str = os.path.join(API_DIR, "cache")
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR, exist_ok=True)
MODEL: keras.models.Sequential = keras.models.load_model(
    os.path.join(API_DIR, "model/circa_model.h5")
)

with open(os.path.join(API_DIR, "model/idx_to_char.json"), "r") as f:
    IDX_TO_CHAR: np.ndarray = np.array(json.load(f))
    CHAR_TO_IDX: Dict[str, int] = {u: i for i, u in enumerate(IDX_TO_CHAR)}

# set up logger
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)
logging.getLogger("urllib3.connectionpool").setLevel(logging.CRITICAL)
LOGGER: logging.Logger = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)

# instantiate application class and set configuration
APP: Flask = Flask(__name__, static_folder="../build", static_url_path="/")
API_ROOT: str = "/api"


def generate_text(
    model: keras.models.Sequential,
    num_generate: int,
    start_string: str,
    temperature: float,
    uid: str,
):
    """
    Evaluation step (generating text using the learned model).
    Low temperatures results in more predictable text.
    Higher temperatures results in more surprising text.
    Experiment to find the best setting.
    """

    try:
        # Converting our start string to numbers (vectorizing)
        input_eval = [CHAR_TO_IDX[s] for s in start_string]
        # turn the single input into a batch by expanding
        input_eval = tf.expand_dims(input_eval, 0)
        # Empty string to store our results
        text_generated = []
        # Here batch size == 1
        model.reset_states()
        for _ in range(num_generate):
            if _ % 50 == 0:
                LOGGER.info("Iteration %s for UID: %s", _, uid)
                sys.stdout.flush()
            predictions = model(input_eval)
            # remove the batch dimension (i.e. dimension of size 1)
            predictions = tf.squeeze(predictions, 0)
            # using a categorical distribution to predict the character
            # this scales the logits toward picking more/less likely chars
            predictions = predictions / temperature
            # picka character at random with a probability equal to the logits
            predicted_id = tf.random.categorical(predictions, num_samples=1)[
                -1, 0
            ].numpy()
            # We pass the predicted character as the next input to the model
            # along with the previous hidden state
            # add a batch dimension again to pass to the model
            input_eval = tf.expand_dims([predicted_id], 0)
            text_generated.append(IDX_TO_CHAR[predicted_id])

        text: str = start_string + "".join(text_generated)

        LOGGER.info("Successfully generated text, UID: %s", uid)
        sys.stdout.flush()

        with open(f"{CACHE_DIR}/{uid}", "w") as f:
            f.write(text)

    except Exception as e:
        LOGGER.error(f"Error generating text: %s", e)
        sys.stdout.flush()
        with open(f"{CACHE_DIR}/{uid}", "w") as f:
            f.write("Server error during text generation.")


@APP.route("/")
def index() -> Response:
    """
    Handle GET requests to root endpoint.
    """
    return APP.send_static_file("index.html")


@APP.route(API_ROOT + "/generate_text", methods=["GET", "POST"])
def lyrics() -> Response:
    """
    Handle POST requests with valid data and invalid GET requests
    to "generate_text" endpoint.
    Upon success, returns a Response containing the generated text.
    Returns a warning response if invalid GET request is issued.
    """
    uid: str = str(uuid.uuid1())
    if request.method == "POST":
        # extract request data and generate text
        data: Dict[str, Any] = json.loads(request.data)
        LOGGER.info(f"Model called with data: %s", data)
        num_generate: int = int(
            data["numGenerate"]) if data["numGenerate"] else 500
        start_string: str = str(
            data["startString"]) if data["startString"] else "A"
        temperature: float = float(
            data["temperature"]) if data["temperature"] else 1.0

        proc: Process = Process(
            target=generate_text,
            args=(MODEL, num_generate, start_string, temperature, uid),
        )
        proc.start()
        return jsonify({"status": "OK", "uid": uid})
    else:
        proc = Process(
            target=generate_text,
            args=(MODEL, num_generate, start_string, temperature, uid),
        )
        proc.start()
        return jsonify({"status": "OK", "uid": uid})


@APP.route(API_ROOT + "/poll", methods=["GET", "POST"])
def poll() -> Response:
    if request.method == "POST":
        # extract request data and generate text
        data: Dict[str, Any] = json.loads(request.data)
        uid: str = data["uid"]
        LOGGER.info(f"Request for text  UID: %s", uid)
        if uid in os.listdir(CACHE_DIR):
            with open(f"{CACHE_DIR}/{uid}", "r") as f:
                text: str = f.read()
            os.remove(f"{CACHE_DIR}/{uid}")
            return jsonify({"completed": True, "text": text})
        else:
            return jsonify({"completed": False, "text": None})
    else:
        return Response("GET not supported.")


@APP.errorhandler(401)
def page_not_found() -> Response:
    """
    Handle 401 errors.
    """
    res: Response = Response("Not found")
    return res


def main() -> None:
    """
    Run the development server.
    """
    LOGGER.info("Starting server on port %s with debug=%s",
                8000, False)
    APP.run(host="0.0.0.0", port=8000, debug=False)


if __name__ == "__main__":
    main()
