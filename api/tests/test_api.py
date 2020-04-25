import mock

from api import api

test_client = api.APP.test_client()


# TODO: add API testing
@mock.patch("api.api.APP.run")
def test_main(mock_run):
    """Docstring in public method."""
    api.main()
    mock_run.assert_called_with(debug=False, host="0.0.0.0", port=8000)
