"""wait for PostgreSQL DB up"""

import sys
import time

from backend.database import init_db


if __name__ == "__main__":
    t_start = time.monotonic()
    while time.monotonic() - t_start < 30:
        try:
            init_db()
            print("DB Connected")
            sys.exit(0)
        except Exception as e:  # pylint: disable=broad-exception-caught
            print("Postgres is not available, sleeping and trying again")
        time.sleep(5)
    sys.exit(1)
