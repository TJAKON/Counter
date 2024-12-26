const anchor = require("@coral-xyz/anchor");
const { SystemProgram } = anchor.web3;

describe("counter_program", () => {
  // Set up the provider and program
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CounterProgram;

  // Keypair for the counter account
  const counter = anchor.web3.Keypair.generate();

  it("Initializes the counter with an initial value", async () => {
    const initialValue = 10;

    // Call the initialize function
    await program.methods
      .initialize(new anchor.BN(initialValue))
      .accounts({
        counter: counter.publicKey,
        owner: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([counter])
      .rpc();

    // Fetch the counter account to verify initialization
    const account = await program.account.counter.fetch(counter.publicKey);
    console.log("Counter value after initialization:", account.value.toString());
    console.log("Owner of the counter:", account.owner.toString());

    // Assertions
    assert.ok(account.value.toString() === initialValue.toString());
    assert.ok(account.owner.toString() === provider.wallet.publicKey.toString());
  });

  it("Increments the counter", async () => {
    // Call the increment function
    await program.methods
      .increment()
      .accounts({
        counter: counter.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();

    // Fetch the counter account to verify increment
    const account = await program.account.counter.fetch(counter.publicKey);
    console.log("Counter value after increment:", account.value.toString());

    // Assertions
    assert.ok(account.value.toString() === "11");
  });

  it("Decrements the counter", async () => {
    // Call the decrement function
    await program.methods
      .decrement()
      .accounts({
        counter: counter.publicKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();

    // Fetch the counter account to verify decrement
    const account = await program.account.counter.fetch(counter.publicKey);
    console.log("Counter value after decrement:", account.value.toString());

    // Assertions
    assert.ok(account.value.toString() === "10");
  });
});
