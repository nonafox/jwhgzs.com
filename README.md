# About update cycle on Github

Not specified at all. For that maybe we will update the repository once in a while such as once or twice a month.

# Configure notice

- usually be deployed on bt-panel
- MUST runs on root user
- you MUST ensure the `/tmp/nitro` directory is NOT affected (e.g. by adding a file with the content `x /tmp/nitro` in `/usr/lib/tmpfiles.d` on CentOS 7), or you will get `503` which is a confusing error