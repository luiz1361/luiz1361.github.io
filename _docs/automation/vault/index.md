**Required ports:**
```
API: 8200, Cluster: 8201
```

**Environment variables:**
```
export VAULT_ADDR=http://127.0.0.1:8200
```

**Vault init autounseal:**
```
vault operator init -recovery-shares=1 -recovery-threshold=1
```

**Check status:**
```
vault status
curl http://localhost:8500/v1/catalog/service/vault | jq .
dig +short @127.0.0.1 -p 8600
```

**Login to Vault CLI:**
```
vault login xxx
```

**Access UI:**
```
http://x.x.x.x:8200/ui
```

**Read secret via CLI:**
```
vault read secret/data/base_test
```

**Example API call to get secret:**
```
curl \
    -H "X-Vault-Token: xxx" \
    -X GET \
    https://vault.service.consul:8200/v1/secret/data/base-test
```

**IAM auto-auth:**
```
vault auth enable aws
vault policy write "example-policy" -<<EOF
path "secret/example_*" {
  capabilities = ["create", "read"]
}
EOF
vault write auth/aws/role/role_iam_luiz_tf_test auth_type=iam bound_iam_principal_arn=arn:aws:iam::xxx:role/role_iam_luiz_tf_test  policies=example-policy max_ttl=500h
vault login -address=https://vault.service.consul:8200 -method=aws header_value=vault.service.consul role=role_iam_luiz_tf_test
```
