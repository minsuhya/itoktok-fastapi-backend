import strawberry

from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

authors: list[str] = []


@strawberry.type
class Query:

    @strawberry.field
    def all_authors(self) -> list[str]:
        return authors


@strawberry.type
class Mutation:

    @strawberry.mutation
    def add_author(self, name: str) -> str:
        authors.append(name)
        return name


schema = strawberry.Schema(query=Query, mutation=Mutation)

router = GraphQLRouter(schema)
