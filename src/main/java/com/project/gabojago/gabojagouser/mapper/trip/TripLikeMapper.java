package com.project.gabojago.gabojagouser.mapper.trip;

import com.project.gabojago.gabojagouser.dto.trip.TripLikeDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TripLikeMapper {
    // 여행정보(맞춤추천) 좋아요 개수
    // 유저가 게시글에 좋아요를 반환
    // 게시글에서 유저가 좋아요를 클릭(등록)
    // 게시글에 로그인한 유저가 좋아요를 했는지 확인
    // 게시글에서 유저가 좋아요를 이미 했다면 좋아요를 취소(삭제)

    TripLikeDto findByTIdAndUId(int tId, String uId);
    String findByTIdAndUIdIsLoginUserId(int tId); // 로그인한 유저가 좋아요를 한 내역

    TripLikeDto countStatusByTId(int tId); // 게시글번호 필요 => 매개변수
    TripLikeDto countStatusByUId(String uId);

    int insertOne(TripLikeDto tripLike);
    int updateOne(TripLikeDto tripLike);
    int deleteOne(TripLikeDto tripLike);

}
