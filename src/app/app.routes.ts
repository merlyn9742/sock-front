import { Routes } from '@angular/router';
import { CategoryComponent } from './shared/category/category.component';
import { ProductComponent } from './shared/product/product.component';
import { PriceRuleComponent } from './shared/price-rule-component/price-rule.component';
import { CostumerComponent } from './shared/costumer-component/costumer-component';

export const routes: Routes = [
    {
        component: CategoryComponent,
        path: 'category'
    },
      {
        component: ProductComponent,
        path: 'products'
    },
    {
        component: PriceRuleComponent,
        path: 'price-rules'
    },
    {
        component: CostumerComponent,
        path: 'customer'
    }
];
