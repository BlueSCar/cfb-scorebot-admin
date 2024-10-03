FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=scorebot-admin-frontend --prod /prod/backend
RUN pnpm deploy --filter=scorebot-admin-frontend --prod /prod/frontend

FROM base as backend
COPY --from=build /prod/backend /prod/backend
WORKDIR /prod/backend
CMD [ "pnpm", "start" ]

FROM base as frontend
COPY --from=build /prod/frontend /prod/frontend
WORKDIR /prod/frontend
CMD [ "pnpm", "start" ]
