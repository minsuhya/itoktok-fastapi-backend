sudo certbot certonly --webroot -w /var/lib/letsencrypt \
	--email minsuhya@gmail.com \
	--agree-tos --no-eff-email \
	-d itoktok-www.gillilab.com  \
       	-d itoktok-api.gillilab.com  \
       	-d itoktok-m.gillilab.com  \
       	-d techlog.gillilab.com  \
       	-d techlog-be.gillilab.com \
	-d n8n-mac.gillilab.com
