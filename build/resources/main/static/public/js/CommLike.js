async function commLikeHandler(cId){
    const likeCont=document.getElementById("likeCont"+cId);
    let url=`/comm/like/${cId}/handler.do`
    //console.log("잘들어가니?");
    const resp=await fetch(url);
    if(resp.status==200){
        const json = await resp.json();
        if(json.handler>0){
            let html=await readLike(cId);
            if(html){
                likeCont.innerHTML=html;
            }else{

            }

        }else if(resp.status==400){
            alert("로그인을 하셔야 이용가능한 서비스 입니다.")
        }else {
            alert("실패")
        }
    }

    async function readLike(cId){//새로고침없이 변환할수있도록
        let url = `/comm/like/${cId}/read.do`;
        const resp=await fetch(url);
        if(resp.status===200){
            const html = await resp.text();
            return html;
        }
    }
}