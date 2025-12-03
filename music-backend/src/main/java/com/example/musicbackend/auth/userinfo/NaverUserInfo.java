package com.example.musicbackend.auth.userinfo;
import com.example.musicbackend.userinfo.OAuth2UserInfo;

import java.util.Map;

public class NaverUserInfo implements OAuth2UserInfo {
    private Map<String, Object> attributes; // response 안에 있는 데이터

    public NaverUserInfo(Map<String, Object> attributes) {
        this.attributes = (Map<String, Object>) attributes.get("response");
    }

    @Override
    public String getProviderId() { return (String) attributes.get("id"); }
    @Override
    public String getProvider() { return "naver"; }
    @Override
    public String getEmail() { return (String) attributes.get("email"); }
    @Override
    public String getName() { return (String) attributes.get("name"); }
}