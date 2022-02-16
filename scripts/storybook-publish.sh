#!/usr/bin/env bash

PUBLIC_SERVER=123.56.176.167
PUBLIC_SERVER_USER=saas


tar zcvf storybook-static.tgz storybook-static
scp -P 3232 -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" storybook-static.tgz ${PUBLIC_SERVER_USER}@${PUBLIC_SERVER}:/qjyd/storybook-static/pc.tgz
ssh -p 3232 -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${PUBLIC_SERVER_USER}@${PUBLIC_SERVER} "sh /qjyd/storybook-static/deploy.sh pc"
rm -f storybook-static.tgz

