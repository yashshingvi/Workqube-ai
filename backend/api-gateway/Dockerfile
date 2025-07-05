FROM kong:3.4

# Copy Kong configuration
COPY kong.yml /etc/kong/kong.yml

# Copy custom plugins if any
# COPY plugins/ /usr/local/kong/plugins/

# Expose ports
EXPOSE 8000 8001 8443 8444

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD kong health

# Start Kong
CMD ["kong", "docker-start"] 