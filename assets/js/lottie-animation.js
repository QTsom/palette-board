// DOM이 완전히 로드된 후 애니메이션 실행

    // gif 화질 안 깨지는 걸로 추가한 파일 스크립트입니다 신경 안 쓰셔도 돼요
    document.addEventListener('DOMContentLoaded', function() {
        // 모든 Lottie 컨테이너에 대해 애니메이션 로드
        document.querySelectorAll('.lottie-container').forEach(container => {
            const animationPath = container.getAttribute('data-animation-path') || '/assets/img/normal_emoji.json';
            const animation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: animationPath
            });

            // 애니메이션 로드 에러 처리
            animation.addEventListener('data_failed', function() {
                console.error('Lottie animation failed to load:', animationPath);
            });

            // 애니메이션 완료 이벤트 처리
            animation.addEventListener('complete', function() {
                console.log('Animation completed:', animationPath);
            });
        });
    });