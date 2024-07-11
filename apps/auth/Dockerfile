### Auth - Build Stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install --force

# Copy the entire project
COPY . ./

# Build the project
RUN npm run build

### Auth - Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json from build stage
COPY --from=build /app/package*.json ./

# Install production dependencies
RUN npm install --only=production --force

# Copy proto folder
COPY --from=build /app/proto ./dist/apps/auth

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Command to start the application
# CMD ["sh", "-c", "cd dist/apps/gateway/src && ls"]

CMD ["node", "dist/apps/auth/src/main.js"]
