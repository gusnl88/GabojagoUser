//console.log("체킹체키라웃!")
async function following(toUser,btn){
    let status=await registerFollow(toUser,false);
    if(status==="1"){
        alert("팔로우 성공!");
        btn.closest(".followCont").remove();
    }else {
        alert("팔로우 실패")
    }
}

async function registerFollow(toUser,follower){
    let url=`/follow/${toUser}/${follower}/handler.do`
    const resp=await fetch(url,{method:"POST"})
    if(resp.status===200){
        let status=await resp.text();
        return status;
    }else if(resp.status===400){
        alert("로그인 하셔야 이용할 수 있는 서비스 입니다.")
    }else if(resp.status===500){
        alert("이미 팔로잉 되었거나, 오류가 발생했으니 새로고침하고 다시 시도하세요.")
    }
}

async function removeFollow(fromUser,follower){
    let  url =`/follow/${fromUser}/${follower}/handler.do`
    const resp=await fetch(url,{method:"DELETE"});
    if(resp.status===200){
        return await resp.text();
    }else if(resp.status===400){
        alert("로그인 하셔야 이용할 수 있는 서비스 입니다.")
    }else if(resp.status===500){
        alert("이미 팔로잉 되었거나, 오류가 발생했으니 새로고침하고 다시 시도하세요.")
    }
}

async function toggleFollower(fromUser,btn){
    let active=(btn.classList.contains("active"));
    if(active) {
        let register = await registerFollow(fromUser, true);
        if (register === "1") {
            btn.classList.remove("active");
            alert("팔로우 삭제 취소")
        } else {
            alert("팔로우 삭제 취소 불가!")
        }
    }else {
        let remove=await removeFollow(fromUser,true);
        if(remove==="1"){
            btn.classList.add("active");
            alert("팔로워 삭제 성공!")
        }else {
            alert("팔로워 삭제 실패")
        }
    }
}
async function toggleFollowing(toUser,btn){
    let active=btn.classList.contains("active");
    if(active){
        let remove=await removeFollow(toUser,false);
        if(remove>0){
            alert("팔로잉 취소 성공!");
            btn.classList.remove("active");
        }else{
            alert("팔로잉 취소 실패");
        }
    }else{
        let register=await registerFollow(toUser,false);
        if(register>0){
            alert("팔로잉 성공");
            btn.classList.add("active")
        }else{
            alert("팔로잉 실패")
        }
    }
}