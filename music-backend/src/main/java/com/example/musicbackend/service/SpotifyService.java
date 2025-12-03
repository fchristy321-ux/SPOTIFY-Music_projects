package com.example.musicbackend.service;

import com.neovisionaries.i18n.CountryCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.specification.*;
import se.michaelthelin.spotify.requests.data.albums.GetAlbumsTracksRequest;
import se.michaelthelin.spotify.requests.data.browse.GetListOfNewReleasesRequest;
import se.michaelthelin.spotify.requests.data.browse.GetRecommendationsRequest;
import se.michaelthelin.spotify.requests.data.search.simplified.SearchTracksRequest;
import se.michaelthelin.spotify.model_objects.specification.Recommendations;
import se.michaelthelin.spotify.requests.data.browse.GetRecommendationsRequest;

//@Service
//의미: 비즈니스 로직을 처리


//SpotifyApi
//의미:스포티파이 통신 기계
//우리가 Config 파일에서 ID와 Secret을 넣어서 조립해둔 기계 이걸로 모든 요청을 보냄

//Paging<T>
//의미: 데이터가 담긴 택배상자
//스포티파이는 데이터를 한번에 다 안주고 페이지 단위로 끊어서 주 <T>는 상자안에 든 내용물의 종류

//Recommendations
//의미: 추천 곡 전용 데이터 상자
 //PAGING과 다르게 추천 결과는 페이지 개념 없어서 별도의 전용 상자에 담겨 옴

//---------------------------------1.로그인(토큰 발급)--------------------------------------------------------//
@Service
public class SpotifyService {

    @Autowired
    private SpotifyApi spotifyApi;

    private void login() {
        try {
            //1.로그인 요청서를 작성 (CLIENT Credentials 방식)
            var clientCredentialsRequest = spotifyApi.clientCredentials().build();

            //2.요청서르 제출하고 토큰을 받아옴
            //clientCredentialsRequest: 로그인 요청서 인증해 달라고 스포티파이에게 보낼 객체
            var clientCredentials = clientCredentialsRequest.execute();

            //3. 받아온 토큰을 기계에 장착
            spotifyApi.setAccessToken(clientCredentials.getAccessToken());
        } catch (Exception e) {
            System.out.println("토큰 발급 실패: " + e.getMessage());
        }
    }
    //why 매번 로그인?: 스포티파이 토큰은 유효시간이 있어서 요청할 때마다 갱신해주는게 가장 안전하기 때문

//---------------------------------2.신곡 조회---------------------------------------------------------//
    public Paging<AlbumSimplified> getNewReleases() {
        //getNewReleases(): 직접 정의한 기능의 이름 , 정리정돈을 위해서:컨트롤러가 복잡한걸 필요없게 하기위함 것임
        try {
            login(); //1. 토큰 장착
            GetListOfNewReleasesRequest getListOfNewReleasesRequest = spotifyApi.getListOfNewReleases()
//GetListOfNewReleasesRequest: 신곡 조회 전용 요청서 양식
// WHY:  이 객체가 없으면 우리는 인터넷 주소창에 https://api.spotify.com/v1/browse/new-releases?limit=10&country=KR 이런 식으로 다 쳐야함
                    .limit(10) //10개만 줘
                    .country(CountryCode.KR) //한국에서 발매된 걸로 줘
                    .build(); //작성 끝

            //3.제출하고 결과 받아와
            return getListOfNewReleasesRequest.execute();
        } catch (Exception e) {
            //Exception e: 자바에서 발생하는 모든 "문제(에러)"들의 대장
            //WHY:  서버가 죽는 것을 막기 위해 , catch (Exception e)를 쓰면, 문제가 생겨도 서버를 끄지 않고 메세지를 띄워 로그만 남기고 넘어갈수있음
            System.out.println("데이터 가져오기 실패: " + e.getMessage());
            return null;
        }
    }
//-------------------------------3.검색-----------------------------------------------------------------//
    public Paging<Track> searchTracks(String keyword) {
        // Paging<T>:  페이지 단위로 포장된 데이터 박스
        //스포티파이는 데이터가 100만 개가 있으면 한 번에 안 주고, 페이지(Page) 단위로 끊어서 줍니다. 이 박스 안에는 items(진짜 데이터 목록), next(다음 페이지 주소), total(전체 개수) 등이 들어있습니다.
        //
        //<T>: 박스 안에 들어있는 내용물의 종류 (예: <Track>이면 노래 박스, <AlbumSimplified>면 앨범 박스).
        try {
            login();

            //노래 검색 요청서 작성
            SearchTracksRequest searchTracksRequest = spotifyApi.searchTracks(keyword)
                    .limit(10)
                    .market(com.neovisionaries.i18n.CountryCode.KR) //한국 시장 기준
                    .build();

            return searchTracksRequest.execute();
        } catch (Exception e) {
            System.out.println("검색 실패: " + e.getMessage());
            return null;
        }
    }
    //-------------------------4.앨범 수록곡 조회-----------------------------------------------------------//

    public Paging<TrackSimplified> getAlbumTracks(String albumId) {
        try {
            login();
            //앨범 수록곡 요청서 작성
            GetAlbumsTracksRequest request = spotifyApi.getAlbumsTracks(albumId)
                    .limit(1) //딱 1곡만 줘 (1번 트랙만 필요하기떄문 )
                    .build();
            return request.execute();
        } catch (Exception e) {
            System.out.println("앨범 트랙 조회 실패: " + e.getMessage());
            return null;
        }
    }
    //--------------------------5. 추천 곡 조회-----------------------------------------------------------------//
    public Recommendations getRecommendedTracks(String seedTrackId) {
        try {
            login();

            //추천 요청서 작성
            GetRecommendationsRequest request = spotifyApi.getRecommendations()
                    .limit(10)
                    .market(CountryCode.KR)
                    .seed_tracks(seedTrackId) //이 노래랑 비스한거 추천해
                    .build();
            return request.execute();
        } catch (Exception e) {
            System.out.println("추천 실패: " + e.getMessage());
            return null;
        }
    }
    //seed_tracks: 추천 알고리즘의 핵심 이 노래를 씨앗으로 심어서 비슷한 노래를 키워내라"는 뜻
}