"""wait for PostgreSQL DB up"""

import logging
import sys
import time

from backend.database import init_db


LOGGER = logging.getLogger()


def wait_for_postgres() -> None:
    """ Wait for postgres to startup. """
    t_start = time.monotonic()
    while time.monotonic() - t_start < 30:
        try:
            init_db()
            LOGGER.info("DB Connected")
            return 0
        except Exception:  # pylint: disable=broad-exception-caught
            LOGGER.warning("Postgres is not available, sleeping and trying again")
        time.sleep(5)
    return 1


if __name__ == "__main__":
    sys.exit(wait_for_postgres())
