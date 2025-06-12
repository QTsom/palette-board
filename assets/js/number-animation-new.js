class CountUpAnimation {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => this.start());
    }

    // 숫자 카운트 애니메이션
    animateCountUp(el, target, delay = 0) {
        setTimeout(() => {
            const start = parseInt(el.textContent) || 0;
            const end = parseInt(target);
            if (start === end) return;

            const duration = 1500;
            const startTime = performance.now();
            const easeInOutQuad = t =>
                t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

            const update = now => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = easeInOutQuad(progress);
                el.textContent = Math.round(start + (end - start) * eased);
                if (progress < 1) requestAnimationFrame(update);
            };

            requestAnimationFrame(update);
        }, delay);
    }

    // 스타일 클래스 업데이트
    updateStyle(wrapper, value) {
        wrapper.classList.remove('is-low', 'is-normal', 'is-high');
        wrapper.classList.add(
            value < 70 ? 'is-low' : value < 90 ? 'is-normal' : 'is-high'
        );
    }

    // 개별 박스 업데이트 (외부 호출용)
    updateSingle(box, value, delay = 0) {
        const numberEl = box.querySelector('.count-number');
        const wrapper = box.closest('.percent-item');
        if (wrapper) this.updateStyle(wrapper, value);
        if (numberEl) this.animateCountUp(numberEl, value, delay);
    }

    // [🔄 테스트용] 랜덤 값으로 전체 박스 업데이트
    updateRandomAll() {
        document.querySelectorAll('.number-box').forEach((box, i) => {
            const value = 80 + Math.floor(Math.random() * 21); // ✅ 70~100
            this.updateSingle(box, value, i * 150); // 약간의 지연
        });
    }

    // 초기 및 주기적 실행
    start() {
        this.updateRandomAll(); // 초기 실행
        setInterval(() => this.updateRandomAll(), 3000); // 주기적 테스트
    }
}

// 인스턴스 생성
const countUp = new CountUpAnimation();

/*
실제 연동할 때 코드 예시

const valueFromServer = 87;
const box = document.querySelector('.number-box');
countUp.updateSingle(box, valueFromServer);

--- 또는 여러 개 처리 시 ---
const boxes = document.querySelectorAll('.number-box');
boxes.forEach((box, i) => {
   const value = data[i]; // 배열 형태의 데이터
   countUp.updateSingle(box, value);
});
*/
