// 主JavaScript文件

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('个人主页已加载');
    
    // 初始化各个组件
    initNavigation();
    // initScrollAnimations(); // 将在任务12中实现
    // initContactForm(); // 将在任务8中实现
});

// ========== 导航组件 ==========

// 初始化导航功能
function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 移动端菜单切换
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // 为所有导航链接添加平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                
                // 如果是移动端菜单，点击后关闭菜单
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // 监听滚动事件，高亮当前区域
    window.addEventListener('scroll', throttle(highlightActiveSection, 100));
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && mobileMenu) {
            // 在桌面视图时关闭移动菜单
            mobileMenu.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// 切换移动端菜单
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggle = document.getElementById('menu-toggle');
    
    if (mobileMenu) {
        const isHidden = mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenu.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }
}

// 高亮当前可见区域对应的导航项
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const navHeight = document.querySelector('#navbar')?.offsetHeight || 0;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-primary', 'font-semibold');
        link.classList.add('text-gray-700');
        
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.remove('text-gray-700');
            link.classList.add('text-primary', 'font-semibold');
        }
    });
}

// ========== 工具函数 ==========

// 工具函数：平滑滚动到指定元素
function smoothScrollTo(target) {
    if (typeof target === 'string') {
        target = document.querySelector(target);
    }
    
    if (target) {
        const navHeight = document.querySelector('#navbar')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// 工具函数：检查元素是否在视口中
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 工具函数：节流函数
function throttle(func, wait) {
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


// ========== 项目筛选功能 ==========

// 初始化项目筛选
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // 更新按钮样式
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700');
            });
            this.classList.remove('bg-white', 'text-gray-700');
            this.classList.add('bg-primary', 'text-white');
            
            // 筛选项目
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});


// ========== 联系表单 ==========

// 初始化联系表单
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // 验证表单
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showFormMessage(errors.join('<br>'), 'error');
        return;
    }
    
    // 表单验证通过
    showFormMessage('消息发送成功！我会尽快回复您。', 'success');
    
    // 重置表单
    document.getElementById('contact-form').reset();
    
    // 3秒后隐藏消息
    setTimeout(() => {
        hideFormMessage();
    }, 3000);
}

// 验证表单数据
function validateForm(formData) {
    const errors = [];
    
    // 验证姓名
    if (!formData.name || formData.name.trim() === '') {
        errors.push('请输入您的姓名');
    }
    
    // 验证邮箱
    if (!formData.email || formData.email.trim() === '') {
        errors.push('请输入您的邮箱');
    } else if (!isValidEmail(formData.email)) {
        errors.push('请输入有效的邮箱地址');
    }
    
    // 验证消息内容
    if (!formData.message || formData.message.trim() === '') {
        errors.push('请输入消息内容');
    } else if (formData.message.trim().length < 10) {
        errors.push('消息内容至少需要10个字符');
    }
    
    return errors;
}

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示表单消息
function showFormMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.innerHTML = message;
    messageDiv.className = type === 'success' 
        ? 'p-4 bg-green-100 text-green-800 rounded-lg' 
        : 'p-4 bg-red-100 text-red-800 rounded-lg';
    messageDiv.classList.remove('hidden');
}

// 隐藏表单消息
function hideFormMessage() {
    const messageDiv = document.getElementById('form-message');
    messageDiv.classList.add('hidden');
}


// ========== 返回顶部按钮 ==========

document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
