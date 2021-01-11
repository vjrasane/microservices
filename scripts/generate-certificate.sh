#!/bin/bash

cert_dir="${JWT_CERT_DIR:-./certs}"
private_cert="./jwt.crt"
public_cert="${cert_dir}/jwt.pub"

openssl genrsa -out "${private_cert}" 2048
openssl rsa \
    -in "${private_cert}" \
    -outform PEM \
    -pubout \
    -out "${public_cert}"