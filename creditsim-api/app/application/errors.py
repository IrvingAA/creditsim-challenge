class PersistenceError(RuntimeError):
    """Raised when a persistence operation fails in the infrastructure layer."""


class SimulationNotFoundError(RuntimeError):
    """Raised when a simulation cannot be found with the provided match keys."""
