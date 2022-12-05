class Candy {
    constructor(flavor, price) {
        this.flavor = flavor;
        this.price = price;
    }
}

class Customer {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

class Order {
    constructor(name, orderDetails) {
        this.id = name;
        this.date = new Date();
        this.orderDetails = orderDetails;
    }

    getTotal() {
        let total = 0;
        for (let orderDetail of this.orderDetails) {
            const candyType = orderDetail.candyType;
            const candyCount = orderDetail.candyCount;
            total += candyType.price * candyCount;
        }
        return total;
    }
}

class CandyShop{
    constructor(){
        this.orders = {};
    }
    
    sell(order){
        this.orders[order.id] = {...order, total: order.getTotal()};
        console.log(this.orders);
    }

    lookUpOrder(name){
        const invoice = document.getElementById("invoice");
        const order = this.orders[name];
        let items = '';

        for (const orderDetail of order.orderDetails) {
            items += `${orderDetail.candyCount} ${orderDetail.candyType.flavor} Candy<br/>`
        }

        invoice.innerHTML =`
        Name: ${order.id}<br/>
        Date: ${order.date}<br/>
        ${items}</br>
        Total: $${order.total}
        `

    }
}


const shop = new CandyShop();
const chocolate = new Candy('chocolate', 2)
const caramel = new Candy('caramel', 1)

function handleSubmit(){
    const form = document.getElementById('OrderForm');
    const data =  Object.fromEntries(new FormData(form).entries());
    const firstName = data['firstName'];
    const lastName = data['lastName'];
    const chocolateCount = Number(data['chocolateCount']);
    const CaramelCount = Number(data['CaramelCount']);

    const customer = new Customer(firstName,lastName);
    const orderDetails = [
        {candyType: chocolate, candyCount: chocolateCount},
        {candyType: caramel, candyCount: CaramelCount}
    ];

    form.reset();

    const order = new Order(customer.fullName(), orderDetails);
    shop.sell(order);

    let table = `
    <tr>
        <th>Customer Name</th>
        <th>Total</th>
    </tr>`;

    for (const order of Object.values(shop.orders)){
        table+= makeTableRow(order.id , order.total)
    }

    function makeTableRow(customerName , total){
        return `
        <tr>
            <td>${customerName}</td>
            <td>$${total}</td>
        </tr>
        `
    };

    document.getElementById("OrderTable").innerHTML = table;

}

function handleSearch(){
    const name= document.getElementById('orderName').value;
    shop.lookUpOrder(name);
}


