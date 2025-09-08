<template>
    <div class="md:col-span-2">
        <label for="fullname" class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
        <input type="text" id="fullname" v-model="shipping.fullName" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <input type="email" id="email" v-model="shipping.email" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
        <input type="tel" id="phone" v-model="shipping.phone" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
        <label for="zipcode" class="block text-sm font-medium text-gray-700 mb-1">CEP</label>
        <input type="text" id="zipcode" v-model="shipping.zipCode" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
        <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
        <input type="text" id="address" v-model="shipping.address" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
        <label for="number" class="block text-sm font-medium text-gray-700 mb-1">Número</label>
        <input type="text" id="number" v-model="shipping.number" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
        <label for="complement" class="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
        <input type="text" id="complement" v-model="shipping.complement"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
        <label for="neighborhood" class="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
        <input type="text" id="neighborhood" v-model="shipping.neighborhood" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
        <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
        <input type="text" id="city" v-model="shipping.city" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
        <label for="state" class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <input type="text" id="state" v-model="shipping.state" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
    </div>
</template>