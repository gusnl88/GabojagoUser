// alert("테스트");
const tripInsertForm=document.forms["tripInsertForm"];
// const phoneInput=tripInsertForm.phone;
//
// async function phoneCheck(e){
//     let phone=phoneInput.value;
//     let url="./phoneCheck.do?"
// }

const tripInsertFrom=document.getElementById("tripInsertFrom");
const submitBtn=document.getElementById("submitBtn");
const titleInput=tripInsertFrom.title;
const addressInput=tripInsertFrom.address;
const contentInput=tripInsertFrom.content;
const mainImgInput=tripInsertFrom.mainImg;
const imgInput=tripInsertFrom.img;


// 여행지명 / 주소입력 / mbti 체크 / 소개글 입력 / 메인이미지 등록 / 서브이미지 등록 /  핸드폰번호 유효성 체크(ajax)


function fileCheck() {
    const mainImg = document.getElementById("mainImg");
    // const subImgs = document.getElementById("subImgs").value;

    if (mainImg==null) {
        alert("파일을 모두 등록해주세요. 이미지도 등록하세요.");
        return false;
    } else {
        return true;
    }
}

// if (!mainImg.value) {

// function mainImgCheck(){
//     let mainImg=tripInsertFrom.mainImg.value;
//     if(mainImg){ // name : 값이 있는 것 //name.trim() : 공백제거 // isNaN(name) : 숫자가 아닌
//         // mainImgMsg.innerText="";
//         mainImgInput.classList.add("is-valid");
//         mainImgInput.classList.remove("is-invalid");
//         mainImgMsg.classList.add("text-success");
//         mainImgMsg.classList.add("valid-feedback");
//         mainImgMsg.classList.remove("text-danger");
//         return true;
//     }else{
//         mainImgInput.scrollIntoView({ behavior: "smooth" });
//         mainImgInput.classList.add("is-invalid");
//         mainImgInput.classList.remove("is-valid");
//         mainImgMsg.innerText="메인이미지를 등록하세요!";
//         mainImgMsg.classList.add("text-danger");
//         mainImgMsg.classList.remove("text-success");
//         return false;
//     }
// }



function titleCheck(){
    let title=tripInsertFrom.title.value;
    // console.log(title)
    if(title && title.trim().length>0){ // name : 값이 있는 것 //name.trim() : 공백제거 // isNaN(name) : 숫자가 아닌
        titleMsg.innerText="";
        titleInput.classList.add("is-valid");
        titleInput.classList.remove("is-invalid");
        titleMsg.classList.add("text-success");
        titleMsg.classList.add("valid-feedback");
        titleMsg.classList.remove("text-danger");
        return true;
    }else{
        titleInput.scrollIntoView({ behavior: "smooth" });
        titleInput.classList.add("is-invalid");
        titleInput.classList.remove("is-valid");
        titleMsg.innerText="여행지명을 입력하세요!";
        titleMsg.classList.add("text-danger");
        titleMsg.classList.remove("text-success");
        return false;
    }
}

// 주소입력 체크
function addressCheck(){
    let address=tripInsertFrom.address.value;
    if(address && address.trim().length>0){ // name : 값이 있는 것 //name.trim() : 공백제거 // isNaN(name) : 숫자가 아닌
        addressMsg.innerText="";
        addressInput.classList.add("is-valid");
        addressInput.classList.remove("is-invalid");
        addressMsg.classList.add("text-success");
        addressMsg.classList.remove("text-danger");
        return true;
    }else{
        addressInput.scrollIntoView({ behavior: "smooth" });
        addressInput.classList.add("is-invalid");
        addressInput.classList.remove("is-valid");
        addressMsg.innerText="주소를 입력하세요!";
        addressMsg.classList.add("text-danger");
        addressMsg.classList.remove("text-success");
        return false;
    }
}

function contentCheck(){
    let content=tripInsertFrom.content.value;
    if(content && content.trim().length>9){ // name : 값이 있는 것 //name.trim() : 공백제거 // isNaN(name) : 숫자가 아닌
        contentMsg.innerText="";
        contentInput.classList.add("is-valid");
        contentInput.classList.remove("is-invalid");
        contentMsg.classList.add("text-success");
        contentMsg.classList.remove("text-danger");
        return true;
    }else{
        contentInput.scrollIntoView({ behavior: "smooth" });
        contentInput.classList.add("is-invalid");
        contentInput.classList.remove("is-valid");
        contentMsg.innerText="소개글을 10글자 이상 입력하세요!";
        contentMsg.classList.add("text-danger");
        contentMsg.classList.remove("text-success");
        return false;
    }
}

// function checkboxCheck() {
//     let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
//     let checkboxMsg = document.getElementById("checkbox-msg");
//
//     if (checkboxes.length > 0) {
//         checkboxMsg.innerText = "";
//         checkboxMsg.classList.add("text-success");
//         checkboxMsg.classList.remove("text-danger");
//         return true;
//     } else {
//         checkboxMsg.scrollIntoView({ behavior: "smooth" });
//         checkboxMsg.innerText = "하나 이상의 체크박스를 선택하세요!";
//         checkboxMsg.classList.add("text-danger");
//         checkboxMsg.classList.remove("text-success");
//         return false;
//     }
// }


tripInsertFrom.onsubmit=function(e){
    e.preventDefault();
    titleCheck();
    addressCheck();
    contentCheck();
    fileCheck();
    if(titleCheck && addressCheck && contentCheck && fileCheck){
        tripInsertFrom.submit();
    }
}

