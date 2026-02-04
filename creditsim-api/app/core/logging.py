import logging
from pythonjsonlogger.json import JsonFormatter

def configure_logging(level: str) -> None:
    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter("%(asctime)s %(levelname)s %(name)s %(message)s"))

    root_logger.handlers.clear()
    root_logger.addHandler(handler)
