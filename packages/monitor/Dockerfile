FROM mcr.microsoft.com/playwright:v1.58.2-jammy
RUN npm install -g pnpm@10.20.0
ENV PNPM_HOME="/root/.pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
CMD ["pnpm", "run", "test:prod"]