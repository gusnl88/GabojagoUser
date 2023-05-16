const searchTagInput=document.getElementById("searchTagInput");
const tagListCont=document.getElementById("tagListCont");

async function searchTags(tag){
    let url=`/hashtag/${tag}/search.do`
    const resp=await fetch(url);
    if(resp.status===200){
        return await resp.json();
    }
}

searchTagInput.addEventListener("input", async (e)=>{
    let tag=searchTagInput.value;
    if(tag.length>0){
        const tags=await searchTags(tag);
        if(tags){
            tagListCont.innerHTML="";
            for(const tagObj of tags) {
                tagListCont.insertAdjacentHTML("beforeend",tagListComponent(tagObj));
            }
        }
    }
})

function tagListComponent(tagObj) {
    return `
                 <a href="/trip/${tagObj.tag}/tagList.do" class="list-group-item d-flex align-items-center">
                    <i class="bi bi-hash border rounded-circle fs-2 d-flex justify-content-center align-items-center" style="width:45px; height: 45px;"></i> <!-- 동그라미 효과 - border rounded-circle // 동그라미 늘어남 없애기(d-flex) align-items-center -->
                    <div class="ms-3">
                        <div>
                            <i class="bi bi-hash"></i>
                            <span>${tagObj.tag}</span>
                        </div>
                        <div>
                            <small>게시물</small>
                            <small>${tagObj.bCnt}</small>
                        </div>
                    </div>
                </a>
            `;
}
