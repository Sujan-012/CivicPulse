package com.civicpulse.backend.jwt;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // Generate a Base64 string from https://www.allkeysgenerator.com/
	private static final String SECRET_KEY =
	        "VGhpc0lzQVN1cGVyU2VjcmV0S2V5Rm9ySldUQXV0aGVudGljYXRpb24xMjM0NTY3ODkw";

    private Key getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);

        return Keys.hmacShaKeyFor(keyBytes);

    }

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith((SecretKey) getSigningKey())
                .compact();

    }

    public String extractEmail(String token) {

        Claims claims = Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();

    }

    public boolean isTokenValid(String token, String email) {

        return extractEmail(token).equals(email);

    }
}