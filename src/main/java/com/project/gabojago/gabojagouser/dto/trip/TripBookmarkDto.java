package com.project.gabojago.gabojagouser.dto.trip;

import lombok.Data;

@Data
public class TripBookmarkDto {
    private int tbId; // pk (auto_increment)
    private int tId; // fk trip.t_id 참조
    private String uId; // fk user.u_id 참조

}
