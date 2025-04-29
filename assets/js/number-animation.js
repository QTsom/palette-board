function createNumberList() {
    const numberList = document.createElement('div');
    numberList.className = 'number-list';
    
    // 0부터 9까지의 숫자를 span으로 감싸서 추가
    for (let i = 0; i <= 9; i++) {
        const span = document.createElement('span');
        span.textContent = i;
        numberList.appendChild(span);
    }
    
    return numberList;
}

function createDigitContainer() {
    const container = document.createElement('div');
    container.className = 'number';
    const numberList = createNumberList();
    container.appendChild(numberList);
    return container;
}

function animateNumber(element, targetValue) {
    const numberList = element.querySelector('.number-list');
    const currentValue = parseInt(numberList.getAttribute('data-current') || '0');
    const targetValueInt = parseInt(targetValue);
    
    if (currentValue === targetValueInt) return;
    
    numberList.setAttribute('data-current', targetValueInt);
    
    const singleNumberHeight = 120/1920 * window.innerWidth;
    const targetPosition = targetValueInt * -singleNumberHeight;
    numberList.style.transform = `translateY(${targetPosition}px)`;
}

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// resize 이벤트에 디바운스 적용
window.addEventListener('resize', debounce(() => {
    const numberLists = document.querySelectorAll('.number-list');
    numberLists.forEach(numberList => {
        const currentValue = parseInt(numberList.getAttribute('data-current') || '0');
        const singleNumberHeight = 120/1920 * window.innerWidth;
        const targetPosition = currentValue * -singleNumberHeight;
        numberList.style.transform = `translateY(${targetPosition}px)`;
    });
}, 150));

// 실시간 데이터 업데이트 시뮬레이션
function simulateRealTimeData() {
    const numberGroups = document.querySelectorAll('.number-group');
    
    numberGroups.forEach(group => {
        
        // 여기서 newValue를 실제 데이터로 변경하세요
        // 현재는 랜덤값(1-100)을 사용하고 있습니다
        // API나 데이터베이스에서 값을 가져오는 로직
        const newValue = Math.floor(Math.random() * 100) + 1;
        const digits = String(newValue).padStart(3, '0').split('');
        
        // 각 자릿수별로 애니메이션 적용
        const digitContainers = group.querySelectorAll('.number');
        digitContainers.forEach((container, index) => {
            // 첫 번째와 두 번째 자리가 0이면 페이드 아웃
            if (index === 0 || index === 1) {
                const shouldHide = digits[index] === '0' && 
                    (index === 0 || (index === 1 && digits[0] === '0'));
                
                // 현재 상태와 다를 때만 클래스 토글
                const isCurrentlyHidden = container.classList.contains('hidden');
                if (shouldHide !== isCurrentlyHidden) {
                    container.classList.toggle('hidden');
                }
                
                // 숫자 변경은 항상 실행
                animateNumber(container, digits[index]);
            } else {
                // 마지막 자리는 항상 보이고 애니메이션
                if (container.classList.contains('hidden')) {
                    container.classList.remove('hidden');
                }
                animateNumber(container, digits[index]);
            }
        });
    });
}

// 초기 설정
function initializeNumbers() {
    const numberElements = document.querySelectorAll('.number');
    
    numberElements.forEach(element => {
        const group = document.createElement('div');
        group.className = 'number-group';
        
        const digit1 = createDigitContainer();
        const digit2 = createDigitContainer();
        const digit3 = createDigitContainer();
        
        group.appendChild(digit1);
        group.appendChild(digit2);
        group.appendChild(digit3);

        // 여기에 초기값 데이터 설정 로직 추가
        // 초기값은 숫자 슬롯 애니메이션으로 인해 반드시 3자리 숫자로 변환해 주셔야 합니다 (예: '001', '042', '100')
        
        element.parentNode.replaceChild(group, element);
    });
}

// 초기화 및 시작
document.addEventListener('DOMContentLoaded', () => {
    initializeNumbers();
    setInterval(simulateRealTimeData, 3000);
}); 