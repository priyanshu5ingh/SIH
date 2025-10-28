flowchart TD
    %% High-Level Overview
    subgraph "1. User Access & Auth"
        A[User Accesses App] --> B{Authenticated?}
        B -->|No| C[Redirect to /auth<br/>Show Login/Sign Up Forms]
        B -->|Yes| D[Fetch Profile from Supabase<br/>Check user metadata for Role]
        D --> E{Profile Exists?}
        E -->|No| F[Upsert Profile<br/>From user metadata<br/>Default role: consumer]
        E -->|Yes| G{Profile Role Null?}
        G -->|Yes| H[Update Profile Role<br/>From user metadata]
        G -->|No| I[Proceed to Dashboard]
        C --> J[User Submits Form<br/>Email/Password + Role Dropdown]
        J --> K{Valid?}
        K -->|No| L[Show Validation Errors]
        K -->|Yes| M[Sign Up/Login via Supabase]
        M --> N{Email Confirmation?}
        N -->|Yes| O[Send Confirmation Email<br/>User Confirms]
        N -->|No| P[Upsert Profile<br/>Navigate to /dashboard]
        O --> P
        L --> J
        P --> D
    end

    %% Role-Based Flows
    subgraph "2. Farmer Workflow"
        Q[Farmer Accesses /farmers<br/>Load Harvest Form] --> R[Click Use My Location<br/>navigator.geolocation.getCurrentPosition]
        R --> S{Geo Supported?}
        S -->|No| T[Show Error<br/>Geolocation Not Supported]
        S -->|Yes| U[Capture Lat/Lng/Accuracy<br/>Display in UI]
        U --> V[Submit Form<br/>Create HarvestSubmission Payload]
        V --> W[Call useSubmitHarvest Hook<br/>Store in Supabase]
        W --> X[Create HARVEST EVENT<br/>Type: harvest, Geo: captured, LotId: response]
        X --> Y[Hash Event via hashEvent<br/>SHA-256 Digest]
        Y --> Z[Anchor to Blockchain via anchorToChain<br/>Generate Tx Hash/Block Number]
        Z --> AA[Display Success Toast<br/>With Short Tx Hash]
        AA --> BB[Reset Form<br/>Clear Geo]
        T --> Q
    end

    subgraph "3. Manufacturer Workflow"
        CC[Manufacturer Accesses /manufacturers<br/>Load Batch Form] --> DD[Submit Form<br/>Create BatchSubmission Payload]
        DD --> EE[Call useSubmitBatch Hook<br/>Store in Supabase]
        EE --> FF[Create PROCESSING EVENT<br/>Type: processing, BatchId: response, InputLots: harvest IDs]
        FF --> GG[Hash Event via hashEvent]
        GG --> HH[Anchor to Blockchain via anchorToChain]
        HH --> II[Display Success Toast]
        II --> JJ[Load QR Generator Section<br/>Product ID, Batch ID Inputs]
        JJ --> KK[Click Generate<br/>createTraceLink + createQrImageUrl]
        KK --> LL[Display QR Image<br/>And Trace Link]
        LL --> MM[Click Print<br/>window.print for Label]
        MM --> NN[End: QR Ready for Packaging]
    end

    subgraph "4. Consumer Workflow"
        OO[Consumer Scans QR on Label] --> PP[QR Links to /trace?pid=...]
        PP --> QQ[Load Trace Page<br/>Fetch Product Data from Supabase]
        QQ --> RR{Product Exists?}
        RR -->|No| SS[Show Error<br/>Invalid Product ID]
        RR -->|Yes| TT[Display Product Info<br/>ID, Name, Status]
        TT --> UU[Show Chain Completeness<br/>Proofs Derived Count, Compliance Badge]
        UU --> VV[Display Origin Section<br/>First Checkpoint: Location, Timestamp, Google Maps Link]
        VV --> WW[Show Checkpoints Timeline<br/>Loop Through Events: Name, Location, Actor, Notes]
        WW --> XX[For Each Checkpoint<br/>Hash Event via hashEvent<br/>Display Proof Badge]
        XX --> YY[Show Authenticity Charts<br/>Integrity Score Over Time]
        YY --> ZZ[Display Supply Chain Timeline<br/>Visual Journey with Emojis]
        ZZ --> AAA[End: Full Verification<br/>Copy Link or Open QR Demo]
    end

    subgraph "5. Trace Page Internal Flow"
        BBB[User Enters Product ID in /trace] --> CCC[Fetch Checkpoints from Supabase<br/>Or Use Demo Data]
        CCC --> DDD{Data Loaded?}
        DDD -->|No| EEE[Show Error<br/>No Checkpoints]
        DDD -->|Yes| FFF[Loop Through Checkpoints]
        FFF --> GGG[For Each Checkpoint<br/>Create TraceEvent]
        GGG --> HHH[Hash Event via hashEvent<br/>SHA-256]
        HHH --> III[Store Hash as Proof<br/>Display as Badge]
        III --> JJJ[End Loop]
        JJJ --> KKK[Display Origin<br/>First Checkpoint with Geo + Map Link]
        KKK --> LLL[Show Summary<br/>Proofs Count, Compliance]
        LLL --> MMM[Render Charts/Timeline]
        MMM --> NNN[End: Full Trace Display]
    end

    %% Connections Between Subgraphs
    I --> Q
    I --> CC
    I --> OO
    AAA --> BBB
    NNN --> OOO[Full System End<br/>Traceability Complete]