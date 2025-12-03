package com.example.musicbackend.repository;

import com.example.musicbackend.entity.MyPlaylist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// JpaRepository를 상속 받아서 MYPLAYLIST테이블을 관리하는 저장 조회 삭제 기능을 가지고 있음
public interface MyPlaylistRepository extends JpaRepository<MyPlaylist, Long> {

    // findByUserIdOrderByAddedAtDesc:
    // findby:찾아  (SELECT * FROM my_playlist)
    //userid:조건은 유저 아이디가 일치하는 것  (WHERE user_id = ?)
    //orderby: 정렬해라 added_at
    //desc: 내림차순으로  DESC
    List<MyPlaylist> findByUserIdOrderByAddedAtDesc(Long userId);

    //boolean:true 아니면 false로 해
    //existBy: 존재하는지 확인
    //userid: 유저아이디
    //and: 그리고
    //trackid: 노래아이도 같은게 있는지

    //why: 같은 노래를 두번, 세번 저장하면안되고 저장하기전에 물어보기 위해서
    boolean existsByUserIdAndTrackId(Long userId, String trackId);
}

// JpaRepository<T, ID>
// 어떤테이블을 관리할지 , 테이블의 타입이 무엇인지 알려주고는  설정

 //<MyPlaylist, Long>:
//MyPlaylist: "이 리포지토리는 MyPlaylist 테이블(엔티티) 담당."
//
//Long: "이 테이블의 ID(Primary Key)는 숫자(Long)."
//  Interface: 구현이 없는 설계도
//why 인터페이스로 만들었는가?: 코드를 직접 짜는게 아니라 이런 기능이 필요해 라고 이름만 적어두면
//Spring Data JPA가 진짜 작동하는 코드를 만들어주기 때문이다.