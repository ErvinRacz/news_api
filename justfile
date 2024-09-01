# List all the just commands
default:
    @just --list

# Build the news api image
docker-build:
    docker build -t news_api . && docker images | grep news_api
# Run news api in a container
docker-run:
    docker run -d --name news_api -p $NEWS_API_PORT:$NEWS_API_PORT -e NEWS_API_PORT=$NEWS_API_PORT -e GNEWS_API_KEY=$GNEWS_API_KEY -e GNEWS_BASE_URL=$GNEWS_BASE_URL news_api
# Run the full stack locally with Colima and Kubernetes
full-stack:
    colima start --kubernetes && sed -e "s|\${GNEWS_API_KEY_PLACEHOLDER}|$GNEWS_API_KEY|g" -e "s|\${GNEWS_BASE_URL_PLACEHOLDER}|$GNEWS_BASE_URL|g" full-stack.yaml | kubectl apply -f - && kubectl port-forward service/news-api-service 8000:8000
