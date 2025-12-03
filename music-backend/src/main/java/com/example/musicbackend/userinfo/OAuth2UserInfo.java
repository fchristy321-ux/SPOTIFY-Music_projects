package com.example.musicbackend.userinfo;

public interface OAuth2UserInfo
{
    String getProviderId();
    String getProvider();
    String getName();
    String getEmail();
}
