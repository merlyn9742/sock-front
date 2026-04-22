import { Routes } from '@angular/router';
import { CategoryComponent } from './shared/category/category.component';
import { ProductComponent } from './shared/product/product.component';
import { PriceRuleComponent } from './shared/price-rule-component/price-rule.component';
import { CostumerComponent } from './shared/costumer-component/costumer-component';
import { BundleFormComponent } from './shared/bundle-form-component/bundle-form-component';
import { BundleListComponent } from './shared/bundle-list-component/bundle-list-component';
import { SaleFormComponent } from './shared/sale-form-component/sale-form-component';
import { CustomerFormModalComponent } from './shared/customer-form-modal-component/customer-form-modal-component';
import { CustomerListComponent } from './shared/customer-list-component/customer-list-component';
import { PurchaseListComponent } from './shared/purchase-list-component/purchase-list-component';
import { SaleList } from './shared/sale-list/sale-list';

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
    },
    {
        component: BundleFormComponent,
        path: 'bundles'
    },
    {
        component: BundleListComponent,
        path: 'bundles/list'
    },
    {
        component: SaleFormComponent,
        path: 'sales'
    },
    {
        component: CustomerListComponent,
        path: 'customers'
    },
    {
        component: PurchaseListComponent,
        path: 'purchases'
    },
    {
        component: SaleList,
        path: 'sales-list'
    }
];
