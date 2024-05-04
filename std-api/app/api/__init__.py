from .auth import router as auth_router
from .books import router as book_router
from .graphql import router as graphql_router
# from .files import router as file_router
# from .heroes import router as hero_router
from .teams import router as team_router
from .tutorials import router as tutorial_router
from .users import router as user_router

__all__ = [
    auth_router,
    user_router,
    hero_router,
    team_router,
    tutorial_router,
    # file_router,
    # book_router,
    graphql_router,
]
