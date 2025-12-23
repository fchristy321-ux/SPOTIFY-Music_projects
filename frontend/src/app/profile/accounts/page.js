//이 페이지의 역할:
//1.로그인된 사용자가 자신의 프로필을 선택하거나 새로운 계정을 추가할 수 있는 진입점 역할
//2.기술적으로는 Next.js의 useRouter와 context API를 활용하여 로그인 여부를 검증
//3.TailwindCSS의 group-hover 기능을 사용해 UI 구현
//비로그인 사용자의 접근을 막는 protected route(보호된 라우트)로직도 포함

//-----------------------1.선언부--------------------------------------------------//
"use client"; //의미: 이파일은 서버가 아니라 브라우저에서 실행
//해석:useState, useEffect, useRouter 같은 기능은 브라우저에서만 돌아가기 때문에, Next.js에게 이 파일은 브라우저용이라고 선언

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Plus, CheckCircle2, User } from "lucide-react";
import { useRouter } from "next/navigation";
// import ... from ...: "오른쪽 경로에 있는 파일에서 왼쪽의 기능을 가져와라.
//@/: 프로젝트의 최상위 폴더(src)를 가리키는 별명(Alias)입니다. 경로를 짧게 쓰기 위해 씀
//lucide-react: 아이콘 라이브러리 이름

//------------------------2.컴포넌트 및 훅 설정-----------------------------------------------
export default function AccountsPage() {
  //export default: "이 파일의 주인공(대표) 함수는 이것이다 (다른 파일에서 import 할 때 기본으로 가져가는 것)
  //function: 함수 정의 시작.

  const { user } = useAuth();
  //단어: const (상수 선언), { user } (구조 분해 할당).
  //해석: "useAuth()라는 훅(함수)을 실행하면 여러 가지 데이터가 담긴 상자(객체)를 주는데, 그중에서 user 라는 이름표가 붙은 데이터만 쏙 뽑아서 내 변수에 담겠다."

  const router = useRouter();
  //useRouter: 페이지를 이동시키는 리모컨 같은 도구
  //해석: "페이지 이동 리모컨을 만들어서 router라는 변수에 저장

  //---------------------------3. 보안 로직--------------------------------------------------//

  if (!user) {
    router.push("/sign-in");
    return null;
  }
  // if: 만약 ~라면.
  //!user: 유저 정보가 없다면 (Not User).
  //router.push: "URL을 이걸로 바꿔서 이동해라." (뒤로 가기 가능)
  //return null: "아무것도 렌더링하지 마라." (화면을 하얗게 만듦. 리다이렉트 되는 찰나에 개인정보가 보이는 걸 막기 위해 필수!)

  //-------------------------4. 화면 그리기 (JSX & Tailwind) - 컨테이너-----------------------------------------------------//
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-white animate-in fade-in duration-500">
      {/*flex: 박스들을 유연하게 배치하겠다 (Flexbox 시작).

flex-col: 내용을 **세로(Column)**로 쌓겠다.

items-center: 가로 기준 가운데 정렬.

justify-center: 세로 기준 가운데 정렬.

min-h-[80vh]: 최소 높이는 화면 높이의 80% (vh: Viewport Height).

animate-in fade-in: 화면이 뜰 때 서서히 나타나는 애니메이션 효과.*/}

      {/* ---------------------------------------------------------------------------- */}
      {/* 타이틀 */}
      <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">
        누구의 음악인가요?
      </h1>
      {/*  text-4xl md:text-5xl: 반응형 폰트 크기 설정 본(모바일)에서는 4xl (약 36px) 크기지만,

              md: (태블릿 이상 화면)에서는 5xl (약 48px)로 더 크게 보여줌 

              Why?: 작은 화면에서는 글자가 너무 커서 줄바꿈이 생기지 않게 하고, 큰 화면에서는 시원하게 보여주기 위함

              tracking-tight: 글자 사이 간격(자간)을 살짝 좁힙니다 (-0.025em). 제목을 더 단단하고 임팩트 있게 만듬
                                                                                                                */}

      {/* 프로필 리스트 컨테이너 */}
      <div className="flex flex-wrap justify-center gap-8">
        {/* --------------------------5. 프로필 카드 부분 (복잡한 CSS)------------------------------------------------------------------------------------------------------ */}

        <Link href="/profile">
          <div className="group flex flex-col items-center gap-4 cursor-pointer">
            {/* Link: 클릭하면 해당 주소로 이동하는 껍데기.

          group (중요!): "나(부모)한테 마우스 올리면, 내 자식들도 반응하게 해라." 라는 선언
          cursor-pointer: 마우스를 올리면 손가락 모양👆으로 변함.
                                                              */}

            <div className="w-32 h-32 md:w-40 md:h-40 rounded-md bg-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-lg group-hover:ring-4 ring-white transition relative overflow-hidden">
              {/*  w-32 h-32: 너비 32(128px), 높이 32.

              md:w-40: 화면이 중간 크기(Tablet) 이상이면 너비를 40으로 키워라. (반응형 디자인)

              rounded-md: 모서리를 둥글게 깎아라.

              group-hover:ring-4: "아까 group이라고 선언한 부모한테 마우스가 올라오면, 나한테 하얀색 테두리 4개를 둘러라." (넷플릭스 효과)

              relative: "내 안에 있는 자식(absolute)들의 위치 기준점이 되겠다."

              overflow-hidden: "내 영역 밖으로 튀어 나가는 자식들은 잘라버려라."*/}

              {user.nickname.substring(0, 1)}
              {/* 
                substring(0, 1): 문자열 자르기 함수. 0번째부터 1번째 전까지, 즉 **"첫 글자"**만 가져옴
                */}

              <div className="absolute top-2 right-2">
                {/* 
              absolute: "부모(relative) 기준으로 좌표를 찍어서 배치
              top-2 right-2: 위에서 2만큼, 오른쪽에서 2만큼 떨어진 곳에 둬라
              */}

                <CheckCircle2
                  className="text-green-400 bg-black rounded-full"
                  size={24}
                />
              </div>

              {/* 호버 시 딤드 효과 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
            </div>
            {/* 
                inset-0: 상하좌우 0, 즉 "부모 크기에 꽉 채워라."

                bg-black/0: 배경색 검정, 투명도 0 (평소엔 안 보임).

                group-hover:bg-black/20: "마우스 올리면 검은색 투명도 20%로 변해라." (살짝 어두워지는 클릭 효과)
                */}
            {/* ---------------------------------------2.이름 텍스트(상호작용 스타일)------------------------------------------------------------------------- */}
            {/* 이름 */}
            <span className="text-gray-400 group-hover:text-white text-lg md:text-xl font-medium transition">
              {user.nickname}
            </span>
          </div>
        </Link>
        {/* 
        text-gray-400: 평소에는 회색 글씨
        group-hover:text-white: 핵심! 부모(group)인 카드 전체에 마우스를 올리면, 자식인 이 글씨가 흰색으로 밝아짐
        text-lg md:text-xl: 이름도 반응형으로, 큰 화면에서는 더 크게(xl) 보여줌
        transition: 색상이 바뀔 때 깜빡이지 않고 부드럽게 변하게함
        */}
        {/* ---------------------------3.계정 추가 버튼(디자인 반전 효과 )------------------------------------------------------------------------------------------------------------------------- */}
        {/* 2. 계정 추가 버튼 (+) */}
        <Link href="/sign-in">
          <div className="group flex flex-col items-center gap-4 cursor-pointer">
            {/* 플러스 아이콘 박스 */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-md bg-[#181818] border-2 border-gray-600 flex items-center justify-center text-gray-400 shadow-lg group-hover:bg-white group-hover:text-black group-hover:border-transparent transition">
              <Plus size={64} />
              {/* 디자인 의도: 내 프로필(보라색)과 다르게, **"비어있는 자리"**라는 느낌을 주기 위해 어두운 배경(bg-[#181818])에 테두리(border-gray-600)만 줌
group-hover:bg-white group-hover:text-black: 마우스를 올리면 배경이 흰색, 아이콘이 검은색으로 완전히 **반전(Invert)
Why?: "새로운 것을 추가한다"는 행위를 시각적으로 강렬하게 표현하기 위함
*/}
            </div>
            {/* 텍스트 */}
            <span className="text-gray-400 group-hover:text-white text-lg md:text-xl font-medium transition">
              계정 추가
            </span>
          </div>
        </Link>
      </div>

      {/* -------------------4.하단 관리 버튼(장식용 UI)------------------------------------------------------- */}
      {/* 하단 관리 버튼 (장식용) */}
      <button className="mt-16 px-8 py-2 border border-gray-500 text-gray-500 text-sm tracking-widest uppercase hover:border-white hover:text-white transition">
        프로필 관리
      </button>
    </div>
  );
}
//tracking-widest: 자간을 아주 넓게(0.1em) 벌립니다. 고급스러운 버튼 느낌을 낼 때 많이 씀
// uppercase: 소문자로 적어도 무조건 대문자로 보여줌
//hover:border-white hover:text-white: 마우스를 올리면 테두리와 글씨가 동시에 하얗게 빛나는 효과를 줌
