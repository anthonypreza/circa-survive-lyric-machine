import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

export default ({ generateText }) => {
  const [numGenerate, setNumGenerate] = useState(null);
  const [startString, setStartString] = useState(null);
  const [temperature, setTemperature] = useState(null);

  const handleNumGenerateChange = (e) => {
    e.preventDefault();
    setNumGenerate(e.target.value);
  };

  const handleStartStringChange = (e) => {
    e.preventDefault();
    setStartString(e.target.value);
  };

  const handleTemperatureChange = (e) => {
    e.preventDefault();
    setTemperature(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateText(numGenerate, startString, temperature);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="numGenerate">
          Number of characters
          <Input
            type="number"
            name="num-generate"
            id="numGenerate"
            placeholder="500"
            onChange={handleNumGenerateChange}
          />
        </Label>
      </FormGroup>
      <FormGroup>
        <Label for="startString">
          Starting text
          <Input
            type="text"
            name="start-string"
            id="startString"
            placeholder="A sequence of characters."
            onChange={handleStartStringChange}
          />
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          Temperature (controls randomness of text generation)
          <Input
            type="number"
            name="temperature"
            id="temperature"
            step="0.1"
            placeholder="1.0"
            onChange={handleTemperatureChange}
          />
        </Label>
      </FormGroup>
      <Button color="info">Generate</Button>
    </Form>
  );
};
