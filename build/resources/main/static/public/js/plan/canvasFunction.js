let page = document.querySelector(".accordion-header");
let box;
if(page){
    box = page.clientWidth-40;
} else {
    box = 500;
}



class CanvasCreate {
    conId; pathId; canvas; ctx;
    layerArr = []; // 레이어 구현용 배열
    activatedTool; //활성화 툴 체크용
    pageSize = box/1200; // 페이지 사이즈 변화에 따른 배율 조졍용(아직)
    currentScale = 1.0; // 줌기능 배율 조졍용
    currentCanvas = new Image(); // 배율 조정시 리로드용
    defaultBack = new Image(); // 초기 배경화면 저장용

    constructor(conId, pathId, path) {
        // 캔버스 불러올 때
        this.conId = conId;
        this.pathId = pathId;
        if (path!==null){
        this.layerArr = JSON.parse(path); // JSON 경로 받아서 다시 js로 변환
        }


        // 캔버스 본체
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")

        // 서브캔버스
        this.canvas.offCanvas = document.createElement('canvas');
        this.canvas.offCtx = this.canvas.offCanvas.getContext('2d');


        // 캔버스 초기화
        this.init()
    }
    init(){

        // 스타일 관련 초기 설정
        this.canvas.width = 1200;
        this.canvas.height = 500;
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 0.5;
        this.ctx.scale(1.0,1.0)
        this.ctx.translate(0,0)
        this.ctx.setLineDash([0,0])
        this.ctx.save();



        // 버튼활성화 및 배경디자인 생성
        this.pageLiner(this.canvas.width,this.canvas.height)

        // 레이어 데이터가 있는 경우 로딩
        this.layerLoad(undefined,true,true);

        this.toolActivation()
        this.colorBtn();

    }

    // 배율 조정 및 윈도우 사이즈 조절시 수정된 좌표값 생성 함수
    xy(xy){
        return xy/this.pageSize
    }
    xyAll(xy){
        return xy/this.pageSize/this.currentScale
    }

    shout(){
        console.log(this.id+ " 번 캔버스가 응답합니다")
    }


    // 캔버스 기본 배경
    pageLiner(width,height){
        let x = 0;
        let y = 0;
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
        while (x<=height){
            this.ctx.beginPath();
            if(x===0 || height-x===0){
                this.ctx.strokeStyle="black"
                this.ctx.lineWidth=1.0;
            } else if(x%50===0){
                this.ctx.strokeStyle="gray"
                this.ctx.lineWidth=0.2;
            } else{
                this.ctx.strokeStyle="gray"
                this.ctx.lineWidth=0.1;
            }
            this.ctx.moveTo(0, x);
            this.ctx.lineTo(width, x);
            this.ctx.stroke();
            x+=10;
        }
        while (y<=width){
            this.ctx.beginPath();
            if(y===0 || y===width){
                this.ctx.strokeStyle="black"
                this.ctx.lineWidth=1.0;
            } else if(y%50===0){
                if(y/50===12){
                    this.ctx.strokeStyle="red"
                    this.ctx.lineWidth=0.3;
                } else {
                    this.ctx.strokeStyle="gray"
                    this.ctx.lineWidth=0.2;
                }
            } else{
                this.ctx.strokeStyle="gray"
                this.ctx.lineWidth=0.1;
            }
            this.ctx.moveTo(y, 0);
            this.ctx.lineTo(y, height);
            this.ctx.stroke();
            y+=10;
        }



        this.currentCanvas.src = this.canvas.toDataURL();
        this.defaultBack.src = this.canvas.toDataURL();
        this.canvasRestore();

    }


    // 사진 등록 툴
    imgTool(){

        let co = this
        let moveHandler;
        let imgElem = new Image();
        let input = document.getElementById("imgInput")
        input.click();
        input.addEventListener("change", (e)=>{
            let selectedFile = input.files[0];
            let fileReader = new FileReader();
            fileReader.readAsDataURL(selectedFile);
            fileReader.onload = function () {
                imgElem.src = fileReader.result;

        function drawHandler(e){
                let startX = e.offsetX;
                let startY= e.offsetY;
                this.addEventListener("mousemove", moveHandler = function (e){
                    co.ctx.beginPath();
                    co.ctx.lineWidth=2;
                    co.ctx.strokeStyle="grey";
                    co.ctx.setLineDash([10, 10]);
                    co.ctx.clearRect(0,0,co.canvas.width,co.canvas.height);
                    co.ctx.drawImage(co.currentCanvas,0,0);
                    co.ctx.strokeRect(
                        co.xy(startX),
                        co.xy(startY),
                        co.xy(e.offsetX)-co.xy(startX),
                        co.xy(e.offsetY)-co.xy(startY));
                    co.ctx.stroke()
                })

                this.addEventListener("mouseup",(e)=>{
                    this.removeEventListener("mousemove", moveHandler)
                    co.ctx.clearRect(0,0,co.canvas.width,co.canvas.height);
                    co.ctx.drawImage(co.currentCanvas,0,0);
                    co.ctx.drawImage(imgElem,
                        co.xy(startX),
                        co.xy(startY),
                        co.xy(e.offsetX)-co.xy(startX),
                        co.xy(e.offsetY)-co.xy(startY));
                    co.canvas.offCanvas.width = co.xy(e.offsetX)-co.xy(startX);
                    co.canvas.offCanvas.height = co.xy(e.offsetY)-co.xy(startY);
                    co.canvas.offCtx.drawImage(imgElem, 0, 0,
                        co.xy(e.offsetX)-co.xy(startX),
                        co.xy(e.offsetY)-co.xy(startY));
                    co.layerPush("img",[co.xy(startX),co.xy(startY)],[co.xy(e.offsetX),co.xy(e.offsetY)],undefined, co.canvas.offCanvas.toDataURL("image/jpeg",0.5))
                    co.canvas.offCtx.clearRect(0,0,1200,500)
                    co.canvas.removeEventListener("mousedown",drawHandler)
                    co.activatedTool = " ";
                    co.canvasRestore();
                },{once:true});
        }
        co.canvas.addEventListener("mousedown",drawHandler)
            };
        })

    };


    //스템프 툴
    stampTool(stamps) {
        let co = this;
        co.currentCanvas.src = co.canvas.toDataURL();
        let moveHandler;
        let imgElem = new Image();
        let imgSrc = `/public/img/plan/${stamps}.png`;
        imgElem.src = imgSrc;
        function drawHandler(e){
            if(co.activatedTool!==stamps){
                co.canvas.removeEventListener("mousedown",drawHandler)
            } else {
                let startX = e.offsetX;
                let startY= e.offsetY;
                this.addEventListener("mousemove", moveHandler = function (e){
                    co.ctx.beginPath();
                    co.ctx.lineWidth=2;
                    co.ctx.strokeStyle="grey";
                    co.ctx.setLineDash([10, 10]);
                    co.ctx.clearRect(0,0,co.canvas.width,co.canvas.height);
                    co.ctx.drawImage(co.currentCanvas,0,0);
                    co.ctx.strokeRect(
                        co.xy(startX),
                        co.xy(startY),
                        co.xy(e.offsetX)-co.xy(startX),
                        co.xy(e.offsetY)-co.xy(startY));
                    co.ctx.stroke()
                })

                // drawImage(image, dx, dy)
                // drawImage(image, dx, dy, dWidth, dHeight)
                // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                // s : 원본이미지 기준(스플리트) d: 기존

                this.addEventListener("mouseup",(e)=>{
                    this.removeEventListener("mousemove", moveHandler)
                    co.ctx.clearRect(0,0,co.canvas.width,co.canvas.height);
                    co.ctx.drawImage(co.currentCanvas,0,0);
                    co.ctx.drawImage(imgElem,
                        co.xy(startX),
                        co.xy(startY),
                        co.xy(e.offsetX)-co.xy(startX),
                        co.xy(e.offsetY)-co.xy(startY));
                    co.layerPush("stamp",[co.xy(startX),co.xy(startY)],[co.xy(e.offsetX),co.xy(e.offsetY)],undefined, imgSrc)
                    co.canvasRestore();
                },{once:true});

            }
        }
        this.canvas.addEventListener("mousedown",drawHandler)
    };


    // 셀렉터 툴
    selectorTool(){
        let co = this;
        let selectedLayer = null;

        function selectHandler(e){
            let eX = co.xy(e.offsetX);
            let eY = co.xy(e.offsetY);

            let sPath;
            let rPath; //확대축소 및 회전을 위한 클릭요소 위치를 저장하기 위한 변수

            // 레이어 역순으로 반복해서 가장 위에 덮인 레이어 선택
            while (selectedLayer == null){
                for(let i = co.layerArr.length-1 ; i>=0 ; i--){
                    /*
                      마우스클릭 위치(e.offset)에 pageSize을 보정해주고 절대 좌표끼리 비교
                      레이어의 range는 currentScale과 개체 자체 scale을 보정해서 범위 해당 여부 파악해주면
                      원하는 위치에 테두리가 그려짐
                     */
                    let scale = co.layerArr[i].scale;
                    let minX = co.layerArr[i].range[0][0]*co.currentScale/scale;
                    let minY = co.layerArr[i].range[0][1]*co.currentScale/scale;
                    let maxX = co.layerArr[i].range[1][0]*co.currentScale/scale;
                    let maxY = co.layerArr[i].range[1][1]*co.currentScale/scale;
                    if((eX>=minX && eX<=maxX) && (eY>=minY && eY<=maxY))
                    {
                        co.ctx.beginPath();
                        co.ctx.strokeStyle="black";
                        co.ctx.lineWidth=1;
                        co.ctx.setLineDash([5, 5]);
                        co.ctx.strokeRect(
                            co.layerArr[i].range[0][0]*co.currentScale/co.layerArr[i].scale-20,
                            co.layerArr[i].range[0][1]*co.currentScale/co.layerArr[i].scale-20,
                            (co.layerArr[i].range[1][0]-co.layerArr[i].range[0][0])*co.currentScale/co.layerArr[i].scale+40,
                            (co.layerArr[i].range[1][1]-co.layerArr[i].range[0][1])*co.currentScale/co.layerArr[i].scale+40);
                        co.ctx.fillStyle="black";

                        // 마우스 이벤트에 pageSize를 보정하지 않기 때문에 클릭요소 좌표에도 보정해 줄 필요는 없다
                        // pageSize 보정 버전으로 수정(05.01)

                        if(sPath===undefined){
                            sPath = new Path2D();
                            sPath.rect(minX-30, minY-30, 20,20);
                            sPath.rect(minX-30, maxY+10, 20,20);
                            sPath.rect(maxX+10, minY-30, 20,20);
                            sPath.rect(maxX+10, maxY+10, 20,20);
                            sPath.closePath();
                        } else {
                            sPath=undefined
                        };

                        if(rPath===undefined) {
                            rPath = new Path2D();
                            rPath.arc(maxX + 60, (maxY + minY) / 2, 10, 0, 2 * Math.PI);
                            rPath.closePath()
                        } else {
                            rPath=undefined
                        }

                        co.ctx.fillRect(minX-25, minY-25, 10,10);
                        co.ctx.fillRect(minX-25, maxY+15, 10,10);
                        co.ctx.fillRect(maxX+15, minY-25, 10,10);
                        co.ctx.fillRect(maxX+15, maxY+15, 10,10);

                        co.ctx.fillStyle="white";
                        co.ctx.fillRect(minX-23, minY-23, 6,6);
                        co.ctx.fillRect(minX-23, maxY+17, 6,6);
                        co.ctx.fillRect(maxX+17, minY-23, 6,6);
                        co.ctx.fillRect(maxX+17, maxY+17, 6,6);

                        co.ctx.setLineDash([5, 5]);
                        co.ctx.moveTo(maxX+20,(maxY+minY)/2);
                        co.ctx.lineTo(maxX+70,(maxY+minY)/2);
                        co.ctx.stroke();

                        co.ctx.beginPath();
                        co.ctx.fillStyle="black";
                        co.ctx.setLineDash([0, 0]);
                        co.ctx.arc(maxX+70, (maxY+minY)/2, 6, 0, 2*Math.PI);
                        co.ctx.stroke();
                        co.ctx.fill();

                        co.canvasRestore();

                        selectedLayer = i;
                        co.canvas.addEventListener("mousedown",moveHandler)
                    } //if
                } //for
            } //while
        } //select

        function moveHandler(e){
            let isMove = true;
            let startX = e.offsetX;
            let startY = e.offsetY;
            co.canvasClear();
            co.layerLoad(selectedLayer,true);
            co.currentCanvas.src = co.canvas.toDataURL();

            co.canvas.addEventListener("mousemove",(e)=>{
                if(isMove){
                    co.ctx.clearRect(0,0,co.canvas.width,co.canvas.height);
                    co.ctx.drawImage(co.currentCanvas,0,0);
                    co.ctx.fillRect(e.offsetX,e.offsetY,50,50)
                }
            })

            co.canvas.addEventListener("mouseup",(e)=>{
                if(isMove){
                    console.log("정지"+e.offsetX,e.offsetY)
                    console.log("마우스 업")
                    isMove = false;
                }
            })
        }

        this.canvas.addEventListener("mousedown",selectHandler)
    };
    textTool(){
        let co = this;
        let moveHandler;
        let font = '18px Noto Sans KR';
        co.currentCanvas.src = co.canvas.toDataURL()
        function drawHandler(e) {
            if(co.activatedTool!=="text"){
                this.removeEventListener("mousedown", drawHandler)
            } else {
                let startX = e.offsetX;
                this.addEventListener("mousemove", moveHandler = function (e){

                    let  input = document.createElement('textarea');
                    input.classList.add("cTextArea")
                    input.style.left = (startX - 4) + "px";
                    input.style.top = (startX - 4) + "px";

                    // input.onkeydown = handleEnter;
                    input.onkeydown = function (e){
                        let keycode = e.keyCode;
                        if (keycode === 13) {
                            co.ctx.textAlign = 'left';
                            co.ctx.font = font;
                            co.ctx.fillText(this.value, 100, 100);
                            // document.body.removeChild(this);
                        }
                    }
                    document.body.appendChild(input);
                    input.focus();
                });
            }
        }
        this.canvas.addEventListener("mousedown", drawHandler);
    };
    palateTool(){};
    postTool(){};

    //직선 툴
    lineTool(){
        let co = this;
        let moveHandler;
        co.currentCanvas.src = co.canvas.toDataURL()
        function drawHandler(e) {
            if(co.activatedTool!=="line"){
                this.removeEventListener("mousedown", drawHandler)
            } else {
                let startX = e.offsetX;
                let startY= e.offsetY;
                this.addEventListener("mousemove", moveHandler = function (e){
                    co.ctx.strokeStyle="grey";
                    co.ctx.lineWidth=2;
                    co.ctx.setLineDash([10, 10]);
                    co.ctx.clearRect(0,0,co.canvas.width,co.canvas.height);
                    co.ctx.drawImage(co.currentCanvas,0,0);
                    co.ctx.beginPath();
                    co.ctx.moveTo(co.xy(startX),co.xy(startY));
                    co.ctx.lineTo(co.xy(e.offsetX),co.xy(e.offsetY));
                    co.ctx.stroke();
                })
                this.addEventListener("mouseup",(e)=>{
                    this.removeEventListener("mousemove", moveHandler);
                    co.canvasRestore();
                    co.ctx.clearRect(0,0,co.canvas.width,co.canvas.height);
                    co.ctx.drawImage(co.currentCanvas,0,0);
                    co.ctx.beginPath();
                    co.ctx.moveTo(co.xy(startX),co.xy(startY));
                    co.ctx.lineTo(co.xy(e.offsetX),co.xy(e.offsetY));
                    co.ctx.stroke();
                    co.layerPush("line",[co.xy(startX),co.xy(startY)],[co.xy(e.offsetX),co.xy(e.offsetY)]);
                },{once:true})
            }
        }
        this.canvas.addEventListener("mousedown", drawHandler);

    };
    //사각형 툴
    rectTool(){
        let co = this;
        let moveHandler;
        co.currentCanvas.src = co.canvas.toDataURL();
        function drawHandler(e) {
            if(co.activatedTool!=="rect"){
                this.removeEventListener("mousedown", drawHandler
                )
            } else {
                let startX = e.offsetX;
                let startY= e.offsetY;
                this.addEventListener("mousemove", moveHandler = function (e){
                    co.ctx.beginPath();
                    co.ctx.lineWidth=2;
                    co.ctx.strokeStyle="grey";
                    co.ctx.setLineDash([10, 10]);
                    co.ctx.clearRect(0,0,co.canvas.width,co.canvas.height);
                    co.ctx.drawImage(co.currentCanvas,0,0);
                    co.ctx.strokeRect(
                        co.xy(startX),
                        co.xy(startY),
                        co.xy(e.offsetX)-co.xy(startX),
                        co.xy(e.offsetY)-co.xy(startY));
                    co.ctx.stroke()
                })
                this.addEventListener("mouseup",(e)=>{
                    this.removeEventListener("mousemove", moveHandler)
                    co.ctx.clearRect(0,0,co.canvas.width,co.canvas.height);
                    co.ctx.drawImage(co.currentCanvas,0,0);
                    co.ctx.beginPath();
                    co.ctx.fillRect(
                        co.xy(startX),
                        co.xy(startY),
                        co.xy(e.offsetX)-co.xy(startX),
                        co.xy(e.offsetY)-co.xy(startY));
                    co.ctx.stroke();
                    co.layerPush("rect",[co.xy(startX),co.xy(startY)],[co.xy(e.offsetX),co.xy(e.offsetY)]);
                    co.canvasRestore();
                },{once:true});
            }
        }
        this.canvas.addEventListener("mousedown", drawHandler);
    };




    //펜 툴
    penTool(){
        let co = this;
        let moveHandler;
        function drawHandler(e) {
            if(co.activatedTool!=="pen"){
                this.removeEventListener("mousedown", drawHandler);
            } else {
                let startX = e.offsetX;
                let startY = e.offsetY;
                let pathArray = [];
                co.ctx.beginPath()
                co.ctx.moveTo(co.xy(startX),co.xy(startY));
                this.addEventListener("mousemove", moveHandler = function (e){
                    pathArray.push([co.xy(e.offsetX),co.xy(e.offsetY)])
                    co.ctx.lineTo(co.xy(e.offsetX),co.xy(e.offsetY));
                    co.ctx.stroke()
                })
                this.addEventListener("mouseup",(e)=>{
                    this.removeEventListener("mousemove", moveHandler)
                    co.layerPush("pen",[co.xy(startX),co.xy(startY)],undefined, pathArray)
                },{once:true})
            }
        }
        this.canvas.addEventListener("mousedown", drawHandler);

    };
    canvasRestore(){
        let co = this;
        co.ctx.restore();
        co.ctx.save();
    }
    canvasClear(){
        let co = this;
        co.ctx.clearRect(0, 0, co.canvas.width, co.canvas.height);
    }
    canvasSave(){
        let co = this;
        co.currentCanvas.src = co.canvas.toDataURL();
    }


    // 경로값 저장용
    layerPush(
        type,
        moveTo = undefined,
        lineTo = undefined,
        path = undefined,
        src = undefined)
    {
        let co = this;

        let tempObj = {
            type : type,
            strokeStyle : co.ctx.strokeStyle,
            fillStyle : co.ctx.fillStyle,
            lineWidth : co.ctx.lineWidth,
            scale : co.currentScale,
            moveTo : moveTo,
            lineTo : lineTo,
            path : path,
            src : src,
            range : [],
            pageSize : co.pageSize,

        }
        function findRange(arr){
            let maxX=0, maxY=0, minX=1200, minY=500;
            arr.forEach((xy)=>{
                if(xy[0]>maxX) maxX=xy[0];
                if(xy[1]>maxY) maxY=xy[1];
                if(xy[0]<minX) minX=xy[0];
                if(xy[1]<minY) minY=xy[1];
            })
            return [[minX,minY],[maxX,maxY]]
        }
        // 범위 저장용
        if(type==="line" || type==="rect") {
            tempObj.range = findRange([moveTo,lineTo]);
        } else if(type==="pen") {
            tempObj.range = findRange(path);
        }

        let socket = JSON.stringify(tempObj)
        stomp.send('/pub/plan/canvas', {}, JSON.stringify({roomId: roomId,pk:co.pathId, path: socket, writer: username}));
        co.currentCanvas.src = co.canvas.toDataURL()
        return co.layerArr.push(tempObj);

    }
    receiver(path) {
        let co = this;
        let c = JSON.parse(path);
        co.ctx.scale(co.currentScale,co.currentScale)
        co.loadFunction(co,c,true);
        co.currentCanvas.src=co.canvas.toDataURL();
        co.canvasRestore();
    }


    layerLoad(index=undefined,rest=true,init=false){
        let co = this;
        let arr = [];

        if(!init){
            co.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        co.ctx.scale(co.currentScale,co.currentScale)
        co.ctx.drawImage(co.defaultBack,0,0);

        if(index===undefined){ arr = co.layerArr;}
        else if(index !== undefined && rest === true){ arr = co.layerArr.filter((c,i)=>{return i !== index });}

        arr.forEach((c)=>{
          co.loadFunction(co,c,true);
        })
        co.currentCanvas.src=co.canvas.toDataURL();
        co.canvasRestore();
    }
    loadFunction(co,c,receive=false){

        co.ctx.strokeStyle=c.strokeStyle;
        co.ctx.fillStyle=c.fillStyle;
        co.ctx.lineWidth=c.lineWidth;

        function modi(xy){
            if(receive === false) return xy;
            else if(receive === true) return xy;
        }

        co.ctx.beginPath();
        co.ctx.moveTo(c.moveTo[0]/c.scale,c.moveTo[1]/c.scale)
        if(c.type==="line") {
            co.ctx.lineTo(c.lineTo[0]/c.scale,c.lineTo[1]/c.scale)
            co.ctx.stroke();
        } else if(c.type==="pen"){
            c.path.forEach((p)=>{
                co.ctx.lineTo(p[0]/c.scale,p[1]/c.scale);
                co.ctx.stroke();
            })
        } else if(c.type==="rect"){
            co.ctx.fillRect(
                c.moveTo[0]/c.scale,
                c.moveTo[1]/c.scale,
                c.lineTo[0]/c.scale-c.moveTo[0]/c.scale,
                c.lineTo[1]/c.scale-c.moveTo[1]/c.scale
            );
        } else if(c.type==="stamp"){
            let img = new Image();
            img.src = c.src;
            img.onload = ()=>{
                co.ctx.drawImage(img,
                    c.moveTo[0]/c.scale*co.currentScale,
                    c.moveTo[1]/c.scale*co.currentScale,
                    c.lineTo[0]/c.scale*co.currentScale-c.moveTo[0]/c.scale*co.currentScale,
                    c.lineTo[1]/c.scale*co.currentScale-c.moveTo[1]/c.scale*co.currentScale
                );
            }
        } else if(c.type==="img"){
            let img = new Image();
            img.src = c.src;
            img.onload = ()=>{
                co.ctx.drawImage(img,
                    c.moveTo[0]/c.scale*co.currentScale,
                    c.moveTo[1]/c.scale*co.currentScale,
                    c.lineTo[0]/c.scale*co.currentScale-c.moveTo[0]/c.scale*co.currentScale,
                    c.lineTo[1]/c.scale*co.currentScale-c.moveTo[1]/c.scale*co.currentScale
                );
            }
        }
    }



    //사이드바 각 버튼에 기능부여
    toolActivation(){
        const co = this;
        const tools = ["pen","line","selector","rect","text","palate","img"];
        const colors = ["red","orange","yellow","green","blue","navy", "purple","black","white"];
        const stamps = ["star", "postIt","postIt2", "polar","heart","marker"]

        tools.forEach((tool)=>{
            document.getElementById(tool+"Btn").addEventListener("click",()=>{
                if(co.activatedTool===tool) return;
                else {
                    co.activatedTool=tool;
                    co[tool+"Tool"]();
                }
            })
        });

        colors.forEach((color)=>{
            document.getElementById(color).addEventListener("click",()=>{
                co.ctx.strokeStyle = color;
                co.ctx.fillStyle = color;
            })
        });

        stamps.forEach((stamps)=>{
            document.getElementById(stamps+"Btn").addEventListener("click",()=>{
                if(co.activatedTool===stamps) return;
                else {
                    co.activatedTool=stamps;
                    co.stampTool(stamps);
                }
            })
        });

        // 테스트중인 기능들
        ///////배열 테스트용/////
        document.getElementById("removeBtn").addEventListener("click", ()=>{
            this.activatedTool="default";
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        });
        ///////배열 테스트용/////
        document.getElementById("loadBtn").addEventListener("click", ()=>{
            this.layerLoad()
            console.log(JSON.stringify(this.layerArr))
        });


        ///////배율조정 테스트용/////
        document.getElementById("plusBtn").addEventListener("click",()=>{
            if (this.currentScale<5.00) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.currentScale *= 1.2;
                this.ctx.scale(1.2, 1.2);
                this.ctx.drawImage(this.currentCanvas,0,0);
                this.ctx.scale(1/1.2, 1/1.2);
                this.currentCanvas.src = this.canvas.toDataURL()
            }
        });
        document.getElementById("minusBtn").addEventListener("click",()=>{
            if (this.currentScale>1.05){
                this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
                this.currentScale/=1.2;
                this.layerLoad();

                this.currentCanvas.src = this.canvas.toDataURL()
            }
        })


    }; // 툴박스


    colorBtn(){
        let buttons = ["red","orange","yellow","green","blue","navy", "purple","black","white"];
        buttons.forEach((content) => {
            let button = document.getElementById(content);
            button.style.background = content;
            button.style.color = "white";
            button.style.borderRadius = "5px";
            button.style.boxShadow = "1px 1px 5px grey";

        });
    }


};//클래스 닫기

