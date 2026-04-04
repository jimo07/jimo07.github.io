// ========== 特效：鼠标跟随粒子光环 ==========
// (function() {
//     if (typeof window === 'undefined') return;

//     const canvas = document.createElement('canvas');
//     canvas.id = 'mouse-trail-canvas';
//     canvas.style.position = 'fixed';
//     canvas.style.top = '0';
//     canvas.style.left = '0';
//     canvas.style.pointerEvents = 'none';
//     canvas.style.zIndex = '9999';
//     document.body.appendChild(canvas);

//     let ctx = canvas.getContext('2d');
//     let particles = [];
//     let mouseX = 0, mouseY = 0;
//     let lastX = 0, lastY = 0;
//     let animationId = null;
//     let frame = 0;

//     function resizeCanvas() {
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//     }
//     window.addEventListener('resize', resizeCanvas);
//     resizeCanvas();

//     document.addEventListener('mousemove', function(e) {
//         mouseX = e.clientX;
//         mouseY = e.clientY;
//         // 每移动一段距离产生多个粒子，形成拖尾
//         const dx = mouseX - lastX;
//         const dy = mouseY - lastY;
//         const distance = Math.hypot(dx, dy);
//         if (distance > 0) {
//             const steps = Math.min(5, Math.floor(distance / 5));
//             for (let i = 0; i <= steps; i++) {
//                 const t = i / steps;
//                 const x = lastX + dx * t;
//                 const y = lastY + dy * t;
//                 addParticle(x, y);
//             }
//         } else {
//             addParticle(mouseX, mouseY);
//         }
//         lastX = mouseX;
//         lastY = mouseY;
//     });

//     function addParticle(x, y) {
//         particles.push({
//             x: x,
//             y: y,
//             radius: Math.random() * 6 + 3,
//             alpha: 0.8,
//             decay: 0.02 + Math.random() * 0.03,
//             color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)` // 蓝绿紫范围
//         });
//     }

//     function draw() {
//         if (!ctx) return;
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
        
//         for (let i = 0; i < particles.length; i++) {
//             const p = particles[i];
//             ctx.beginPath();
//             ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
//             ctx.fillStyle = p.color;
//             ctx.globalAlpha = p.alpha;
//             ctx.fill();
//             // 粒子缩小并透明度降低
//             p.radius -= 0.1;
//             p.alpha -= p.decay;
//             if (p.radius <= 0.2 || p.alpha <= 0) {
//                 particles.splice(i, 1);
//                 i--;
//             }
//         }
//         animationId = requestAnimationFrame(draw);
//     }
//     draw();

//     // 可选的：当鼠标静止时停止粒子产生（但保留绘制）
//     let idleTimer;
//     document.addEventListener('mousemove', function() {
//         clearTimeout(idleTimer);
//         idleTimer = setTimeout(() => {
//             // 鼠标静止5秒后清空所有粒子
//             if (particles.length > 0) particles = [];
//         }, 5000);
//     });
// })();

// // ========== 特效：鼠标跟随图标 ==========
(function(){
    if (typeof window === 'undefined') return;

    const img = document.createElement('div')
    img.className = 'mouseImg'
    document.body.appendChild(img)

    // 鼠标最新位置
    let targetX=0,targetY=0;
    // 图片所在位置
    let currentX=0,currentY=0;

    // 监听鼠标移动时间，实时记录鼠标位置
    window.addEventListener('mousemove',(event)=>{
        targetX = event.clientX
        targetY = event.clientY
    })

    // 更新跟随图片的实际位置
    function animation(){
        // 新位置 = 当前位置 + (目标位置 - 当前位置) * 缓动系数
        // 系数越小，跟随越“黏”，延迟越大；系数越大，跟随越跟手。
        currentX+=(targetX-currentX)*0.8;
        currentY+=(targetY-currentY)*0.8;

        img.style.left = (currentX-img.offsetWidth/2) + 'px';
        img.style.top = (currentY-img.offsetHeight/2) + 'px';

        // 请求下一帧继续执行animation，形成不间断的动画循环
        requestAnimationFrame(animation);
    }
    animation()

    document.addEventListener('mouseleave',()=>{
        img.style.opacity='0'
    })
    document.addEventListener('mouseenter',()=>{
        img.style.opacity='1'
    })

})();


// ========== 特效：点击爆炸粒子 ==========
(function() {
    if (typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.id = 'click-explode-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9998';
    document.body.appendChild(canvas);

    let ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    document.addEventListener('click', function(e) {
        const clickX = e.clientX;
        const clickY = e.clientY;
        const particleCount = 30; // 每次点击生成30个粒子

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            particles.push({
                x: clickX,
                y: clickY,
                vx: vx,
                vy: vy,
                radius: Math.random() * 5 + 2,
                alpha: 1,
                decay: 0.01 + Math.random() * 0.02,
                color: `hsl(${Math.random() * 360}, 80%, 60%)`,
                gravity: 0.2,
                friction: 0.98
            });
        }
    });

    function updateAndDraw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            // 更新速度（重力、摩擦）
            p.vy += p.gravity;
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            p.radius *= 0.99; // 慢慢缩小
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            
            if (p.alpha <= 0.02 || p.radius <= 0.5 || p.y > canvas.height + 100 || p.x < -100 || p.x > canvas.width + 100) {
                particles.splice(i, 1);
                i--;
            }
        }
        animationId = requestAnimationFrame(updateAndDraw);
    }
    updateAndDraw();
})();

// ========== 特效：loading ==========
(function(){
    if (sessionStorage.getItem('loaderDone') === '1') {
        // 直接移除 loader
        const el = document.getElementById('custom-loader');
        if (el) el.remove();
        return;
    }

    // 创建loading容器
    const loaderDiv = document.createElement('div')
    loaderDiv.id = 'custom-loader'

    const bgDiv = document.createElement('div')
    bgDiv.className = 'load-bg'

    const loaderText = document.createElement('div')
    loaderText.className  = 'loader-text'

    loaderDiv.appendChild(bgDiv)
    loaderDiv.appendChild(loaderText)

    document.body.appendChild(loaderDiv)

    let load = 0

    // 定义scale工具函数
    const scale=(num,in_min,in_max,out_min,out_max)=>{
        return (out_max-out_min)*(num-in_min)/(in_max-in_min)+out_min
    }

    // 设置循环定时器
    let int = setInterval(blurring,30)

    function blurring() {
        load++
        if(load>99){
            clearInterval(int);
            // 淡出并移除
            loaderDiv.style.transition = 'opacity 0.5s';
            loaderDiv.style.opacity = '0';
            setTimeout(()=>{
                loaderDiv.remove
            },500)
            
        }
        loaderText.innerText=`${load}%`
        loaderText.style.opacity=scale(load,0,100,1,0)
        bgDiv.style.filter = `blur(${scale(load,0,100,30,0)}px)`
    }
})();