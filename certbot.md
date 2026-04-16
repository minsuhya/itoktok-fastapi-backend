HAProxy에서 사용할 `gillilab.com.pem` 은 **하나의 파일 안에 다음 3가지를 순서대로 합친 형태**여야 합니다.

1. **Private Key (privkey.pem)**
2. **Server Certificate (cert.pem 또는 fullchain.pem)**
3. **Intermediate Chain (chain.pem)**

---

## 1️⃣ 기본 원칙 (HAProxy용 PEM 구조)

HAProxy는 하나의 `.pem` 파일에 아래 순서로 들어가야 합니다.

```
-----BEGIN PRIVATE KEY-----
(개인키)
-----END PRIVATE KEY-----

-----BEGIN CERTIFICATE-----
(서버 인증서)
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
(Intermediate CA)
-----END CERTIFICATE-----
```

즉,

> 🔥 **privkey.pem + fullchain.pem**
>
> 이 조합이 가장 간단하고 안전합니다.

---

## 2️⃣ 현재 서버 구조 기준

지금 경로는 다음과 같습니다.

```
/etc/letsencrypt/live/itoktok-www.gillilab.com/
    cert.pem
    chain.pem
    fullchain.pem
    privkey.pem
```

여기서:

| 파일            | 의미           |
| ------------- | ------------ |
| cert.pem      | 서버 인증서만      |
| chain.pem     | 중간 CA        |
| fullchain.pem | cert + chain |
| privkey.pem   | 개인키          |

---

## 3️⃣ 권장 조합 (가장 안전)

```bash
sudo cat \
/etc/letsencrypt/live/itoktok-www.gillilab.com/privkey.pem \
/etc/letsencrypt/live/itoktok-www.gillilab.com/fullchain.pem \
| sudo tee /etc/haproxy/certs/gillilab.com.pem
```

그 후 권한 설정:

```bash
sudo chown root:haproxy /etc/haproxy/certs/gillilab.com.pem
sudo chmod 640 /etc/haproxy/certs/gillilab.com.pem
```

---

## 4️⃣ 여러 도메인 SAN 인증서인 경우

만약 certbot을 다음처럼 발급했다면:

```bash
-d itoktok-www.gillilab.com \
-d itoktok-api.gillilab.com \
-d techlog.gillilab.com
```

→ 하나의 `live/<도메인>/` 폴더에 SAN 인증서가 생성됩니다.
→ 이 경우 위 방식 그대로 사용하면 됩니다.

---

## 5️⃣ HAProxy 설정 예시

```haproxy
frontend https
    bind *:443 ssl crt /etc/haproxy/certs/gillilab.com.pem
    mode http
```

또는 여러 인증서를 폴더로 지정 가능:

```haproxy
bind *:443 ssl crt /etc/haproxy/certs/
```

---

## 6️⃣ 🔥 자동 갱신 후 재적용 (실무 중요)

certbot 갱신 후 haproxy 재시작 자동화:

`/etc/letsencrypt/renewal-hooks/deploy/haproxy.sh`

```bash
#!/bin/bash
cat \
/etc/letsencrypt/live/itoktok-www.gillilab.com/privkey.pem \
/etc/letsencrypt/live/itoktok-www.gillilab.com/fullchain.pem \
> /etc/haproxy/certs/gillilab.com.pem

chown root:haproxy /etc/haproxy/certs/gillilab.com.pem
chmod 640 /etc/haproxy/certs/gillilab.com.pem

systemctl reload haproxy
```

권한:

```bash
chmod +x /etc/letsencrypt/renewal-hooks/deploy/haproxy.sh
```

---

# ✅ 최종 정답

> HAProxy용 PEM은
> **privkey.pem + fullchain.pem** 을 합치면 된다.

---

필요하시면:

* 여러 도메인 각각 다른 인증서 사용하는 SNI 구조
* 와일드카드 인증서 구성
* HAProxy SSL 성능 튜닝 (TLS1.3, ALPN, http2)
* 무중단 reload 전략

까지 정리해드리겠습니다.

