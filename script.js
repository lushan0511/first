// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取表单和输入元素
    const form = document.getElementById('rent-calculator');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsSection = document.getElementById('results');
    
    // 获取所有自定义金额输入框和其对应的选择器
    const customFields = {
        'deposit': document.getElementById('custom-deposit'),
        'key-money': document.getElementById('custom-key-money'),
        'agency-fee': document.getElementById('custom-agency-fee')
    };
    
    // 启用/禁用自定义输入框
    Object.keys(customFields).forEach(field => {
        const selector = document.getElementById(field);
        const customInput = customFields[field];
        
        selector.addEventListener('change', function() {
            if (this.value === 'custom') {
                customInput.disabled = false;
                customInput.focus();
            } else {
                customInput.disabled = true;
                customInput.value = '';
            }
        });
    });
    
    // 地区平均费用数据 (示例数据，可以根据实际情况调整)
    const regionData = {
        'tokyo': {
            'apartment': 4.5,
            'mansion': 5.0,
            'house': 5.5
        },
        'osaka': {
            'apartment': 4.0,
            'mansion': 4.5,
            'house': 5.0
        },
        'fukuoka': {
            'apartment': 3.5,
            'mansion': 4.0,
            'house': 4.5
        }
    };
    
    // 添加计算按钮事件监听器
    calculateBtn.addEventListener('click', calculateCosts);
    
    // 计算费用函数
    function calculateCosts() {
        // 获取输入值
        const region = document.getElementById('region').value;
        const propertyType = document.getElementById('property-type').value;
        const monthlyRent = parseFloat(document.getElementById('monthly-rent').value) || 0;
        
        // 检查月租金是否有效
        if (monthlyRent <= 0) {
            alert('请输入有效的月租金金额');
            return;
        }
        
        // 计算各项费用
        const depositValue = calculateFieldValue('deposit', monthlyRent);
        const keyMoneyValue = calculateFieldValue('key-money', monthlyRent);
        const agencyFeeValue = calculateAgencyFee(monthlyRent);
        
        const guaranteeFee = parseFloat(document.getElementById('guarantee-fee').value) || 0;
        const cleaningFee = parseFloat(document.getElementById('cleaning-fee').value) || 0;
        const keyExchangeFee = parseFloat(document.getElementById('key-exchange-fee').value) || 0;
        const fireInsurance = parseFloat(document.getElementById('fire-insurance').value) || 0;
        const otherFees = parseFloat(document.getElementById('other-fees').value) || 0;
        
        // 计算总费用
        const initialCosts = {
            '押金 (敷金)': depositValue,
            '礼金 (礼金)': keyMoneyValue,
            '中介费 (仲介手数料)': agencyFeeValue,
            '保证金/保险费': guaranteeFee,
            '清洁费': cleaningFee,
            '钥匙交换费': keyExchangeFee,
            '火灾保险费': fireInsurance,
            '其他费用': otherFees
        };
        
        // 计算初期费用总计
        const totalInitialCost = Object.values(initialCosts).reduce((sum, fee) => sum + fee, 0);
        
        // 计算第一个月总支出（初期费用 + 第一个月租金）
        const firstMonthTotal = totalInitialCost + monthlyRent;
        
        // 计算月租金倍数
        const rentMultiple = totalInitialCost / monthlyRent;
        
        // 显示结果
        displayResults(initialCosts, totalInitialCost, firstMonthTotal, rentMultiple, region, propertyType, monthlyRent);
    }
    
    // 计算基于月租金的字段值（押金、礼金等）
    function calculateFieldValue(fieldId, monthlyRent) {
        const selector = document.getElementById(fieldId);
        const customInput = document.getElementById(`custom-${fieldId}`);
        
        if (selector.value === 'custom') {
            return parseFloat(customInput.value) || 0;
        } else {
            return monthlyRent * parseFloat(selector.value);
        }
    }
    
    // 计算中介费（考虑税费）
    function calculateAgencyFee(monthlyRent) {
        const selector = document.getElementById('agency-fee');
        const customInput = document.getElementById('custom-agency-fee');
        const includeTax = document.getElementById('agency-fee-tax').checked;
        
        let fee;
        if (selector.value === 'custom') {
            fee = parseFloat(customInput.value) || 0;
        } else {
            fee = monthlyRent * parseFloat(selector.value);
        }
        
        return includeTax ? fee * 1.1 : fee; // 10% 消费税
    }
    
    // 显示计算结果
    function displayResults(costs, totalInitialCost, firstMonthTotal, rentMultiple, region, propertyType, monthlyRent) {
        // 更新总计金额
        document.getElementById('total-initial-cost').textContent = formatNumber(totalInitialCost);
        document.getElementById('first-month-total').textContent = formatNumber(firstMonthTotal);
        
        // 更新费用明细
        const breakdownList = document.getElementById('cost-breakdown');
        breakdownList.innerHTML = '';
        
        Object.entries(costs).forEach(([name, value]) => {
            if (value > 0) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${name}</span>
                    <span>${formatNumber(value)} 円</span>
                `;
                breakdownList.appendChild(listItem);
            }
        });
        
        // 添加第一个月租金到明细
        const rentItem = document.createElement('li');
        rentItem.innerHTML = `
            <span>第一个月租金</span>
            <span>${formatNumber(monthlyRent)} 円</span>
        `;
        breakdownList.appendChild(rentItem);
        
        // 更新地区比较
        const regionAverage = regionData[region][propertyType];
        document.getElementById('region-average').textContent = regionAverage.toFixed(1);
        document.getElementById('your-ratio').textContent = rentMultiple.toFixed(1);
        
        // 显示结果区域
        resultsSection.classList.remove('hidden');
        
        // 滚动到结果区域
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 格式化数字为易读形式
    function formatNumber(num) {
        return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
});
