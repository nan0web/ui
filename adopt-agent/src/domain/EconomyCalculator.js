import { resolveAliases, resolveDefaults } from '@nan0web/types'

export class EconomyCalculator {
	static mission = {
		help: 'Навіщо ми це створюємо? Яка фундаментальна місія для людства? (Фільтр на рабство грошей)',
		default: 'Покращення життя та свободи',
	}

	static developmentCost = {
		help: 'Очікувані витрати на розробку (в годинах або USDT)',
		default: 1000,
	}

	static monthlyPrice = {
		help: 'Вартість підписки (USDT) для суверенного користувача',
		default: 18,
	}

	static expectedUsers = {
		help: 'Очікувана кількість суверенних користувачів (Аудиторія)',
		default: 100,
	}

	/** @type {string} */
	mission = EconomyCalculator.mission.default

	/** @type {number} */
	developmentCost = EconomyCalculator.developmentCost.default

	/** @type {number} */
	monthlyPrice = EconomyCalculator.monthlyPrice.default

	/** @type {number} */
	expectedUsers = EconomyCalculator.expectedUsers.default

	constructor(data = {}) {
		resolveDefaults(EconomyCalculator, this)
		Object.assign(this, resolveAliases(EconomyCalculator, data))
	}

	evaluate() {
		const isMoneySlavery =
			this.mission.toLowerCase().includes('заробити') ||
			this.mission.toLowerCase().includes('гроші') ||
			this.mission.toLowerCase().includes('money')

		const monthlyRevenue = this.monthlyPrice * this.expectedUsers
		const monthsToROI = this.developmentCost / monthlyRevenue

		return {
			aligned: !isMoneySlavery,
			monthlyRevenue,
			monthsToROI: isFinite(monthsToROI) ? Number(monthsToROI.toFixed(1)) : '∞',
			verdict: isMoneySlavery
				? '🚨 УВАГА: Продукт схожий на рабство заради грошей. Відхилено місією.'
				: '✅ Місія прийнята. Проєкт має фундаментальну цінність.',
		}
	}
}
