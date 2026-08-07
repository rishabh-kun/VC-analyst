"""
Centralized logging utility for the VC Analyst project.
"""

import logging
import os
import sys


def get_logger(name: str) -> logging.Logger:
    """Configures and returns a logger instance for the given module name.

    Args:
        name (str): Name of the logger (typically __name__).

    Returns:
        logging.Logger: Configured logger instance.
    """
    logger = logging.getLogger(name)

    # Prevent adding duplicate handlers if logger is already configured
    if logger.hasHandlers():
        return logger

    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    logger.setLevel(getattr(logging, log_level, logging.INFO))

    # Console Handler
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger
