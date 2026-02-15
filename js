import { LightningElement, track } from 'lwc';
import getSubscriptions from '@salesforce/apex/SubscriptionViewerController.getSubscriptions';


export default class SubscriptionViewer extends LightningElement {

    @track data = [];
    @track columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Account', fieldName: 'AccountName' },
        { label: 'Product', fieldName: 'Product_Name__c' },
        { label: 'Status', fieldName: 'Contract_Status__c' },
        { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date' },
        { label: 'End Date', fieldName: 'End_Date__c', type: 'date' }
    ];

    pageSize = 25;
    lastRecordId = null;
    loading = false;

    connectedCallback() {
        this.loadData();
    }

    loadData() {
        this.loading = true;

        getSubscriptions({
            pageSize: this.pageSize,
            lastRecordId: this.lastRecordId
        })
        .then(result => {

            let mapped = result.records.map(row => {
                return {
                    ...row,
                    AccountName: row.Account__r ? row.Account__r.Name : ''
                };
            });

            this.data = [...this.data, ...mapped];

            if (result.records.length > 0) {
                this.lastRecordId = result.records[result.records.length - 1].Id;
            }

            this.loading = false;
        })
        .catch(error => {
            console.error(error);
            this.loading = false;
        });
    }

    handleLoadMore() {
        this.loadData();
    }
}
