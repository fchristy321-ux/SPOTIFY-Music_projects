package com.example.musicbackend.controller;

import com.example.musicbackend.entity.MyPlaylist;
import com.example.musicbackend.repository.MyPlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@RequestBody:
//택배상자(body) 안에 든 물건을 꺼내서 자바 객체로 바꿈
//데이터저장(post) 수정(PUT)할떄 사용 주소창에 안보이고 데이터가 HTTP본문(body)에 숨어서 오기때문

//ResponseEntity<?>
//응답 상태 코드와 데이터를 함께 담는 편지봉투
//<?>(와일드카드):봉투안에 성공하면 객체를 넣고 실패하면 에러 메시지를 넣음. 타입은 아직모름

//@DeleteMapping:
//삭제 요청이 오면 처리
//-------------------클래스설정-----------------------------//
@RestController
@RequestMapping("/api/library")
public class LibraryController {
    @Autowired
    private MyPlaylistRepository repository;

//해석: 프론트엔드에서 http://.../api/library로 시작하는 요청이 오면 이 클래스가 깨어남
    //실제 db작업(save.delete등)은 repository에게 시킴
    //------------------------------------------------//

    //-------------------보관함 추가-----------------------------//

    // 요청: POST /api/library (Body에 노래 정보 JSON 포함)
    @PostMapping
    public ResponseEntity<?> addTrack(@RequestBody MyPlaylist track) {
        //@RequestBody MyPlaylist track:
        // 프론트엔드(NEXT.JS)가 보낸 것  { "title": "Hype Boy", "artist": "NewJeans" ... }
        // 스프링이 변환한 것: track.setTitle("Hype Boy"); track.setArtist("NewJeans");
        //WHY: 사용자가 하트를 눌렀을때 노래정보를 DB에 영구 저장 하기위해서

// 1. 임시 유저 ID 설정 (아직 로그인이 없으니까 1번 유저라고 가정)
        Long tempUserId = 1L;

        //// 2. 프론트에서 온 노래 데이터(track)에 "이거 1번 유저 거야"라고 도장을 찍음
        track.setUserId(tempUserId);
    //3. 중복 체크
        if (repository.existsByUserIdAndTrackId(tempUserId, track.getTrackId())) {
            //이미 있으면 400에러와 함꼐 거절 메세지 반환
            return ResponseEntity.badRequest().body("이미 보관함에 있는 노래입니다");
        }
        //4. 저장 실행
        MyPlaylist savedTrack = repository.save(track);
        //5.성공적으로 저장된 데이터를 200OK와 함꼐 돌려줌
        return ResponseEntity.ok(savedTrack);
    }
    //------------------------------------------------//

//---------------------------보관함 조회-----------------------------//

    @GetMapping
    public ResponseEntity<List<MyPlaylist>> getMyLibrary() {
        Long tempUserId = 1L; //1번 유저인척 함

        //2.DB 관리인에게 1번 유저가 최신순으로 저장한거 다 가져오라고 시킴
        //결과는 LIST형태로 나옴
        return ResponseEntity.ok(repository.findByUserIdOrderByAddedAtDesc(tempUserId));
    }
    //해석: 보관함 페이지에 들어갔을때 내가 저장했던 노래 목록을 뿌려주기 위한 기능
    //----------------------------------------------------------------------

//------------------------------보관함 삭제 -------------------------------------------
    // 3. 보관함 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrack(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
//@PathVariable Long id:
//주소창 .../library/5 에서 숫자 5를 낚아채서 id 변수에 넣음
//WHY: 먗 번째 노래를 지울지 정확히 집어주기 위해서임

// ---------------------------------------------------------------------------------------


