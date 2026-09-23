// Shared case-study blocks for the Loving Tech customer success project. Used
// both for the warehouse entry and the Spiro profile override.

export const lovingTechBlocks = [
  {
    type: 'intro',
    eyebrow: 'Customer success',
    heading: 'A support system that ran on WhatsApp',
    text: 'Loving Tech sells tech gear online in Cameroon. I was brought in for four months as a customer success consultant to fix one pain point: people bought a product, then had no simple way to reach the shop when something went wrong. I designed the support system and the order journey around the channel people here already use all day, WhatsApp.',
  },
  {
    type: 'intro',
    eyebrow: 'The problem',
    heading: 'Complaints had nowhere to go',
    text: 'Orders came in through the site, but questions and complaints arrived as scattered messages. The team answered the same things by hand, and a customer with a problem had no clear path to a person. That is the pain point I was called in to solve.',
  },
  {
    type: 'steps',
    eyebrow: 'The support system',
    heading: 'A message, a bot, then a human',
    text: 'The system met the customer where they already were.',
    items: [
      {
        title: 'One number',
        text: 'The customer sends a message to a single WhatsApp number, the channel they use every day.',
      },
      {
        title: 'Answered from a bank of questions',
        text: 'A bot answers the common questions from a bank of prepared answers, so simple things are handled without waiting.',
      },
      {
        title: 'Escalated to the right team',
        text: 'When the bot cannot answer, it routes the complaint to the team that owns it, instead of leaving it in one inbox.',
      },
      {
        title: 'Delivery follow-up',
        text: 'The bot also confirms delivery: it asks the customer to confirm they received the item and to send a photo as proof, with buttons to say otherwise.',
      },
    ],
  },
  {
    type: 'gallery',
    eyebrow: 'The build',
    heading: 'The support system',
    items: [
      {
        image: 'lovingtech-whatsapp-bot.png',
        title: 'The WhatsApp bot',
        description: 'The bot answering from prepared templates, confirming delivery and handing over to a person.',
      },
      {
        image: 'lovingtech-whatsapp-api.jpg',
        title: 'The WhatsApp API',
        description: 'How the WhatsApp API connects to the shop so a message reaches the right team.',
      },
    ],
  },
  {
    type: 'steps',
    eyebrow: 'The order journey',
    heading: 'Find, order, pay, track',
    items: [
      {
        title: 'Find and add to cart',
        text: 'The customer searches the catalogue and adds a product to the cart.',
      },
      {
        title: 'Choose how to pay',
        text: 'They can pay online, or pay on delivery after inspecting the item.',
      },
      {
        title: 'Delivery or pickup',
        text: 'They choose home delivery or a relay point, and leave their WhatsApp number.',
      },
      {
        title: 'Track the order',
        text: 'Every order gets a reference and a tracking link. The state moves from received to confirmed to shipped to delivered, and each change sends an email with a button to check the status.',
      },
    ],
  },
  {
    type: 'gallery',
    eyebrow: 'The order journey',
    heading: 'From the shelf to the door',
    items: [
      {
        image: 'lovingtech-storefront.png',
        title: 'The storefront',
        description: 'Product search, categories and the daily promotions.',
      },
      {
        image: 'lovingtech-cart.png',
        title: 'The cart',
        description: 'The cart drawer, with payment on delivery after inspection.',
      },
      {
        image: 'lovingtech-order-confirmation.png',
        title: 'Order confirmation',
        description: 'The order is saved with a reference, then the customer confirms on WhatsApp.',
      },
      {
        image: 'lovingtech-order-tracking.png',
        title: 'Order tracking',
        description: 'The order states, from received to delivered, with help one tap away.',
      },
      {
        image: 'lovingtech-track-lookup.png',
        title: 'Track any order',
        description: 'Customers can look up any order with the reference they were sent.',
      },
    ],
  },
  {
    type: 'stat-cards',
    cards: [
      {
        icon: 'message',
        title: 'One channel',
        text: 'Support, order confirmation and delivery follow-up all run on WhatsApp, where the customers already are.',
      },
      {
        icon: 'sparkles',
        title: 'Self-service first',
        text: 'A bank of prepared answers handles the common questions before a person is needed.',
      },
      {
        icon: 'route',
        title: 'Every order has a status',
        text: 'A reference and a tracking link, with an email and a button at every state change.',
      },
    ],
  },
  {
    type: 'richtext',
    markdown:
      'The pain point was not the website. It was what happened after the order. Meeting customers on WhatsApp, answering what we could automatically, and giving every order a status they could check reduced the back and forth and let the team focus on the real problems.',
  },
];
