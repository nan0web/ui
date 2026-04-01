import User from './User/User.js'
import * as DomainModels from '../domain/index.js'

const Model = {
	User,
	...DomainModels,
}

export { User }
export const {
	HeaderModel,
	FooterModel,
	HeroModel,
	ButtonModel,
	ConfirmModel,
	InputModel,
	SpinnerModel,
	TableModel,
	ToastModel,
	SelectModel,
	AutocompleteModel,
	TreeModel,
	TabsModel,
	AccordionModel,
	GalleryModel,
	PriceModel,
	PricingModel,
	CommentModel,
	TestimonialModel,
	StatsItemModel,
	StatsModel,
	TimelineItemModel,
	TimelineModel,
} = DomainModels

export default Model
