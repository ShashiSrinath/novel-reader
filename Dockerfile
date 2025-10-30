# Stage 1: Build the application
# Use a stable Bun image for the build environment
FROM oven/bun:1.3.1 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and lock file (if it exists)
COPY package.json bun.lockb* ./

# Install dependencies
# Using --production to only install dependencies, but since this is a build stage, 
# we need devDependencies for the build command (vite build).
# We'll just use bun install.
RUN bun install

# Copy the rest of the application code
COPY . .

# Run the build script
RUN bun run build

# Stage 2: Create the final production image
# Use a smaller, slim Bun image for the runtime environment
FROM oven/bun:1.3.1-slim AS runner

# Set the working directory
WORKDIR /app

# Copy the necessary files from the builder stage
# .output contains the built server and client assets
COPY --from=builder /app/.output ./.output
# package.json is needed to run the 'start' script
COPY package.json ./

# The application runs on port 3000 (based on your dev script)
EXPOSE 3000

# Command to run the application
# The start script is "bun run .output/server/index.mjs"
CMD ["bun", "run", "start"]
