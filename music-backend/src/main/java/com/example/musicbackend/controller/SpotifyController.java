package com.example.musicbackend.controller;

import com.example.musicbackend.service.SpotifyService;
import com.example.musicbackend.service.YouTubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.model_objects.specification.*;

//@RestController
//의미: 여기는 html이 아니라 데이터(json)만 주는 api서버이다
//프론트엔드(NEXT.JS)와 대화할때는 무조건 이걸 씀

//@RequestMapping
//이 컨트롤러의 대표주소는 /api/spotify이다
//이 파일 안의 모든 기능은 http://.../api/spotify 로 시작

//@Autowired
//의미: 스프링아 내가 일일이 new로 만들기 귀찮으니까 너가 미리 만들어둔 서비스(일꾼) 좀 여기 꽃아줘 (의존성주입)

//@GetMapping
//의미: 조회요청이 들어오면 이 함수를 실행해 (데이터를 변경하지 않고 가져오기만 할때 씀 )

//------------------------------1.클래스 선언 및  일꾼 고용---------------------------------------------------
@RestController
@RequestMapping("/api/spotify") // 1.기본 주소 설정
public class SpotifyController {

    @Autowired
    private SpotifyService spotifyService; //2. 음악 담당 일꾼 주입

    @Autowired
    private YouTubeService youTubeService; //3. 영상 담당 일꾼 주입


    //----------------------------2.신곡조회----------------------------------------//
  //요청: GET /api/spotify/new-releases
    @GetMapping("/new-releases")
    public Paging<AlbumSimplified> getNewReleases() {
        // "음악 일꾼아, 신곡 리스트 좀 받아와."
        return spotifyService.getNewReleases();
    }
//    Paging<AlbumSimplified>:
    //스포티파이가 주는 데이터 포장지이다 앨범 정보(AlbumSimplified)들이 (Paging)별로 담겨있다는 뜻
    //이걸 리턴하면 스프링이 알아서 예쁜 JSON으로 바꿔서 프론트엔드에 줌

//---------------------------3.검색기능--------------------------------------------------------//
    // 요청: GET /api/spotify/search?q=검색어
    @GetMapping("/search")
    public Paging<Track> search(@RequestParam("q") String keyword) {
        // @RequestParam("q"): 주소창의 "?q=아이유" 에서 "아이유"를 꺼내 keyword에 담음.
        return spotifyService.searchTracks(keyword);
    }
//    @RequestParam:
//            옵션 검색. 주소 뒤에 ?를 붙여서 데이터를 보낼 때 사용
//-----------------------------4.앨범 수록속 조회--------------------------------------------------------------------
    // 앨범 수록곡 조회 API
    @GetMapping("/album/{albumId}/tracks")
    public Paging<TrackSimplified> getAlbumTracks(@PathVariable("albumId") String albumId) {
        return spotifyService.getAlbumTracks(albumId);
    }
//@PathVariable:
    //"고유 주소"**입니다. 특정 앨범을 콕 집어서 말할 때는 경로(Path) 자체에 ID를 넣음

    //---------------------------5.유튜브 영상ID조회 -------------------------------------------------------------//

    //// 요청: GET /api/spotify/youtube-video?query=뉴진스+HypeBoy
    @GetMapping("/youtube-video")
    public String getYouTubeVideo(@RequestParam("query") String query) {
        //영상 일꾼아 ,이검색어(query)로 재생 가능한 유튜브 ID 하나만 찾아와
        return youTubeService.searchVideoId(query);
    }
}