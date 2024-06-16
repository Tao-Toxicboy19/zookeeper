### Exchange - Build Stage
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

# Generate Prisma Client
RUN npx prisma generate

### Exchange - Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json from build stage
COPY --from=build /app/package*.json ./

# Install production dependencies
RUN npm install --only=production --force

# Copy generated Prisma Client
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Command to start the application
CMD ["node", "dist/apps/exchange/src/main.js"]
