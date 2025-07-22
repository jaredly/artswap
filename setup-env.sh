#!/bin/bash
cp .env.example .env
echo "Please configure the following in .env:"
echo "- MAILGUN_API_KEY"
echo "- MAILGUN_DOMAIN"
echo "- SESSION_SECRET (generate with: openssl rand -base64 32)"
echo "- JWT_SECRET (generate with: openssl rand -base64 32)"
