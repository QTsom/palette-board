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

// 숫자 시퀀스 생성 함수
function generateSequence(current, target, rounds = 2) {
    const result = [];
    
    // 같은 숫자일 때도 2바퀴 돌도록 수정
    let totalSteps;
    if (current === target) {
        // 같은 숫자: 2바퀴 돌면서 같은 숫자로 돌아옴
        totalSteps = rounds * 10;
    } else {
        // 다른 숫자: 기존 로직
        totalSteps = rounds * 10 + ((target - current + 10) % 10);
    }
    
    for (let i = 0; i <= totalSteps; i++) {
        result.push((current + i) % 10);
    }
    
    // 디버깅용 로그 (나중에 제거 가능)
    console.log(`시퀀스 생성: ${current} → ${target}, ${rounds}바퀴, 총 ${result.length}개 숫자:`, result);
    
    return result;
}

// span 시퀀스 렌더링 함수
function renderSpanSequence(numberList, sequence, digitIndex = 0) {
    // 기존 span들 제거
    numberList.innerHTML = '';
    
    // 새로운 시퀀스로 span 생성
    sequence.forEach((num, index) => {
        const span = document.createElement('span');
        span.textContent = num;
        span.setAttribute('data-index', index);
        
        // 첫 번째 자리에서 1이 아닌 숫자들은 투명하게 처리
        if (digitIndex === 0 && num !== 1) {
            span.style.opacity = '0';
        }
        
        numberList.appendChild(span);
    });
}

// 애니메이션 실행 함수
function animateToEnd(numberList, sequence, digitIndex = 0) {
    const singleNumberHeight = 120/1920 * window.innerWidth;
    const totalHeight = (sequence.length - 1) * singleNumberHeight;
    
    // 자릿수별로 정확한 애니메이션 지속 시간 적용
    let animationDuration;
    if (digitIndex === 0) {
        // 첫 번째 자리: 0.8초
        animationDuration = 0.8;
    } else if (digitIndex === 1) {
        // 두 번째 자리: 1초
        animationDuration = 1.0;
    } else {
        // 세 번째 자리: 1.2초
        animationDuration = 1.2;
    }
    
    // 애니메이션 시작
    numberList.style.transition = `transform ${animationDuration}s ease-out`;
    numberList.style.transform = `translateY(-${totalHeight}px)`;
    
    // 애니메이션 완료 후 정리
    setTimeout(() => {
        cleanupAfterAnimation(numberList, sequence);
    }, animationDuration * 1000);
}

// 애니메이션 완료 후 정리 함수
function cleanupAfterAnimation(numberList, sequence) {
    const finalValue = sequence[sequence.length - 1];
    
    // transition 제거하고 정확한 위치로 이동
    numberList.style.transition = 'none';
    numberList.style.transform = 'translateY(0px)';
    
    // 마지막 숫자만 남기고 나머지 제거
    numberList.innerHTML = '';
    const finalSpan = document.createElement('span');
    finalSpan.textContent = finalValue;
    numberList.appendChild(finalSpan);
    
    // 현재 값 업데이트
    numberList.setAttribute('data-current', finalValue);
    
    // 다음 애니메이션을 위해 transition 복원
    setTimeout(() => {
        numberList.style.transition = 'transform 1.7s ease-out';
    }, 50);
}

// 다음 업데이트를 위한 초기화 함수
function resetToStart(numberList) {
    const currentValue = parseInt(numberList.getAttribute('data-current') || '0');
    
    // 현재 값으로 초기 span 생성
    numberList.innerHTML = '';
    const span = document.createElement('span');
    span.textContent = currentValue;
    numberList.appendChild(span);
    
    numberList.style.transform = 'translateY(0px)';
}

// 개선된 숫자 애니메이션 함수
function animateNumber(element, targetValue, digitIndex = 0) {
    const numberList = element.querySelector('.number-list');
    const currentValue = parseInt(numberList.getAttribute('data-current') || '0');
    const targetValueInt = parseInt(targetValue);
    
    // 자릿수별로 다른 바퀴 수 적용
    let rounds;
    if (digitIndex === 0) {
        // 첫 번째 자리: 1만 나오므로 바퀴 수 제한 없음
        rounds = 0; // 바퀴 수 제한 없음
    } else if (digitIndex === 1) {
        // 두 번째 자리: 1바퀴
        rounds = 1;
    } else {
        // 세 번째 자리: 2바퀴
        rounds = 2;
    }
    
    // 숫자가 같아도 지정된 바퀴 수만큼 돌면서 같은 숫자로 돌아오는 효과
    const sequence = generateSequence(currentValue, targetValueInt, rounds);
    
    // span 시퀀스 렌더링 (자릿수 인덱스 전달)
    renderSpanSequence(numberList, sequence, digitIndex);
    
    // 애니메이션 실행 (자릿수 인덱스 전달)
    animateToEnd(numberList, sequence, digitIndex);
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
        // 100%가 나올 확률을 높이기 위한 로직
        let newValue;
        const random = Math.random();
        
        // 25% 확률로 100%가 나오도록 설정
        if (random < 0.2) {
            newValue = 100;
        } else {
            // 나머지 75%는 1-99 범위에서 랜덤
            newValue = Math.floor(Math.random() * 99) + 1;
        }
        
        // 여기서 newValue를 실제 데이터로 변경하세요
        // 현재는 랜덤값(1-100)을 사용하고 있습니다
        // API나 데이터베이스에서 값을 가져오는 로직
        const digits = String(newValue).padStart(3, '0').split('');
        
        // 현재 전체 값 가져오기 (모든 자릿수를 조합해서)
        const allDigitContainers = group.querySelectorAll('.number');
        let currentValue = 0;
        
        // 각 자릿수의 현재 값을 조합해서 전체 값 계산
        allDigitContainers.forEach((container, index) => {
            const digitValue = parseInt(container.querySelector('.number-list')?.getAttribute('data-current') || '0');
            if (index === 0) {
                currentValue += digitValue * 100; // 첫 번째 자리는 100의 자리
            } else if (index === 1) {
                currentValue += digitValue * 10;  // 두 번째 자리는 10의 자리
            } else {
                currentValue += digitValue;       // 세 번째 자리는 1의 자리
            }
        });
        
        const newValueInt = parseInt(newValue);
        
        // 전체 값이 같으면 애니메이션 비활성화
        const shouldAnimate = currentValue !== newValueInt;
        
        // 각 자릿수별로 애니메이션 적용
        const digitContainers = group.querySelectorAll('.number');
        digitContainers.forEach((container, index) => {
            if (index === 0) {
                // 첫 번째 자리: 1일 때만 보이기
                const shouldHide = digits[index] !== '1';
                
                // 현재 상태와 다를 때만 클래스 토글
                const isCurrentlyHidden = container.classList.contains('hidden');
                if (shouldHide !== isCurrentlyHidden) {
                    container.classList.toggle('hidden');
                }
                
                // 첫 번째 자리는 전체 값이 다르면 애니메이션 실행
                if (shouldAnimate) {
                    animateNumber(container, digits[index], index);
                }
            } else if (index === 1) {
                // 두 번째 자리: 첫 번째가 0이고 현재가 0일 때만 숨기기
                const shouldHide = digits[index] === '0' && digits[0] === '0';
                
                // 현재 상태와 다를 때만 클래스 토글
                const isCurrentlyHidden = container.classList.contains('hidden');
                if (shouldHide !== isCurrentlyHidden) {
                    container.classList.toggle('hidden');
                }
                
                // 숫자 변경은 전체 값이 다르면 실행
                if (shouldAnimate) {
                    animateNumber(container, digits[index], index);
                }
            } else {
                // 마지막 자리는 항상 보이고 애니메이션
                if (container.classList.contains('hidden')) {
                    container.classList.remove('hidden');
                }
                if (shouldAnimate) {
                    animateNumber(container, digits[index], index);
                }
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

        // 초기값을 0으로 설정하고 첫 번째, 두 번째 자리 숨기기
        const initialDigits = ['0', '0', '0'];
        
        // 각 자릿수별로 초기값 설정 및 숨김 처리
        const digitContainers = [digit1, digit2, digit3];
        digitContainers.forEach((container, index) => {
            const numberList = container.querySelector('.number-list');
            numberList.setAttribute('data-current', initialDigits[index]);
            
            if (index === 0) {
                // 첫 번째 자리: 0이므로 숨기기
                container.classList.add('hidden');
            } else if (index === 1) {
                // 두 번째 자리: 첫 번째가 0이고 현재가 0이므로 숨기기
                container.classList.add('hidden');
            }
            // 세 번째 자리는 항상 보임
        });
        
        element.parentNode.replaceChild(group, element);
    });
}

// 초기화 및 시작
document.addEventListener('DOMContentLoaded', () => {
    initializeNumbers();
    setInterval(simulateRealTimeData, 4000);
}); 